const pool = require('../db');

const walletController = {
    getWallet: async (req, res) => {
        try {
            const { userId } = req.params;
            const result = await pool.query('SELECT * FROM wallets WHERE user_id = $1', [userId]);
            if (result.rows.length === 0) {
                // Initialize wallet if not exists
                const init = await pool.query(
                    'INSERT INTO wallets (user_id, balance) VALUES ($1, 0) RETURNING *',
                    [userId]
                );
                return res.json(init.rows[0]);
            }
            res.json(result.rows[0]);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to fetch wallet' });
        }
    },

    getTransactions: async (req, res) => {
        try {
            const { userId } = req.params;
            const result = await pool.query(
                'SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC',
                [userId]
            );
            res.json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to fetch transactions' });
        }
    },

    getSupportedBanks: async (req, res) => {
        try {
            const payChanguService = require('../services/payChanguService');
            const banks = await payChanguService.getSupportedBanks();
            res.json(banks);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch banks' });
        }
    },

    withdrawFunds: async (req, res) => {
        const { userId, amount, method, details } = req.body; // details: { mobile, bank_code, account_number, etc. }
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            // 1. Check Balance
            const walletRes = await client.query('SELECT balance FROM wallets WHERE user_id = $1 FOR UPDATE', [userId]);
            if (walletRes.rows.length === 0) throw new Error('Wallet not found');

            const currentBalance = parseFloat(walletRes.rows[0].balance);
            if (currentBalance < amount) throw new Error('Insufficient funds');

            // 2. Fetch User Details for Payout (Email, Name)
            const userRes = await client.query('SELECT name, email, phone FROM users WHERE id = $1', [userId]);
            const user = userRes.rows[0];
            const chargeId = `WD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

            // 3. Process Payout via PayChangu (External API)
            // We do this BEFORE committing to DB to ensure API success, 
            // BUT strict distributed transaction usually suggests: Deduct -> Try Pay -> Refund if fail.
            // Here we'll: Deduct (Pending) -> Pay -> Update Status.

            // 3a. Deduct Balance Immediately (Pending State)
            await client.query('UPDATE wallets SET balance = balance - $1 WHERE user_id = $2', [amount, userId]);

            const trxRes = await client.query(
                `INSERT INTO transactions (user_id, gross_amount, net_amount, commission_amount, type, method, status, transaction_ref) 
                 VALUES ($1, $2, $2, 0, 'Withdrawal', $3, 'Processing', $4) RETURNING *`,
                [userId, amount, method, chargeId]
            );

            await client.query('COMMIT'); // Commit the pending deduction

            // 4. Call PayChangu API (Outside DB Transaction to avoid locking)
            const payChanguService = require('../services/payChanguService');
            let apiResult;

            try {
                if (method === 'Mobile Money' || method === 'Airtel Money' || method === 'TNM Mpamba') {
                    apiResult = await payChanguService.initiatePayout({
                        mobile: details?.mobile || user.phone,
                        amount: amount,
                        mobile_money_operator_ref_id: details?.bank_code || (method === 'Airtel Money' ? 'airtel' : 'tnm'),
                        charge_id: chargeId,
                        email: user.email,
                        first_name: user.name.split(' ')[0],
                        last_name: user.name.split(' ')[1] || 'User'
                    });
                } else if (method === 'Bank') {
                    apiResult = await payChanguService.initiateBankPayout({
                        bank_code: details?.bank_code,
                        account_number: details?.account_number,
                        account_name: details?.account_name || user.name,
                        amount: amount,
                        charge_id: chargeId,
                        email: user.email
                    });
                } else {
                    // Fallback for direct testing
                    apiResult = { status: 'success', message: 'Manual processing' };
                }

                // 5. Update Transaction to Completed
                await pool.query("UPDATE transactions SET status = 'Completed' WHERE id = $1", [trxRes.rows[0].id]);
                res.json({ success: true, transaction: trxRes.rows[0], payout: apiResult });

            } catch (apiError) {
                console.error("Payout API Failed:", apiError);
                // Refund the user if API fails
                await pool.query('UPDATE wallets SET balance = balance + $1 WHERE user_id = $2', [amount, userId]);
                await pool.query("UPDATE transactions SET status = 'Failed', description = $1 WHERE id = $2", ['API Error: ' + apiError.message, trxRes.rows[0].id]);

                res.status(400).json({ error: 'Payout failed at provider. Funds refunded.', details: apiError.message });
            }

        } catch (err) {
            await client.query('ROLLBACK');
            console.error(err);
            res.status(500).json({ error: err.message || 'Withdrawal processing failed' });
        } finally {
            client.release();
        }
    }
};

module.exports = walletController;
