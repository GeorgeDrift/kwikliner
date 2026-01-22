const pool = require('../db');
const { v4: uuidv4 } = require('uuid');
const payChanguService = require('../services/payChanguService');

/**
 * Get supported mobile money operators
 */
exports.getOperators = async (req, res) => {
    try {
        const operators = await payChanguService.getMobileMoneyOperators();
        res.json(operators);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Initiate Payment
 */
exports.initiatePayment = async (req, res) => {
    const { rideId, amount, mobileNumber, providerRefId } = req.body;
    // Note: io is handled via req.app.get('io') if Socket.io is used, 
    // but we'll focus on the DB and API logic first.

    console.log(`💰 [PayChangu] Initiating charge: ${amount} to ${mobileNumber} for Shipment ${rideId}`);

    try {
        // 1. Create Pending Transaction in DB
        // Mapping user's ORM logic to SQL
        const transRef = `PENDING-${uuidv4()}`;
        const query = `
            INSERT INTO transactions (user_id, shipment_id, gross_amount, net_amount, commission_amount, type, status, transaction_ref, method)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
        `;
        const values = [req.user.id, rideId, amount, amount, 0, 'Ride Payment', 'Pending', transRef, 'Mobile Money'];
        const transResult = await pool.query(query, values);
        const transaction = transResult.rows[0];

        // 2. Call PayChangu API
        const paymentResponse = await payChanguService.initiatePayment({
            mobile: mobileNumber,
            amount: amount,
            mobile_money_operator_ref_id: providerRefId
        });

        // 3. Update Transaction with PayChangu details
        const chargeId = paymentResponse.data?.charge_id || paymentResponse.charge_id;
        if (chargeId) {
            await pool.query(
                'UPDATE transactions SET transaction_ref = $1 WHERE id = $2',
                [chargeId, transaction.id]
            );
        }

        res.json({
            status: 'success',
            message: 'Payment initiated. Please approve on your phone.',
            data: paymentResponse
        });

    } catch (err) {
        console.error("Payment Initiation Error:", err);
        res.status(500).json({ error: err.message });
    }
};

/**
 * Verify Payment
 */
exports.verifyPayment = async (req, res) => {
    const { chargeId } = req.params;
    const io = req.app.get('io');

    try {
        const verification = await payChanguService.verifyPayment(chargeId);
        const status = verification.data?.status; // 'success', 'pending', 'failed'

        if (status === 'success') {
            // Find transaction by reference (chargeId)
            const transResult = await pool.query('SELECT * FROM transactions WHERE transaction_ref = $1', [chargeId]);
            const transaction = transResult.rows[0];

            if (transaction && transaction.status !== 'completed') {
                await pool.query('BEGIN');

                // Update transaction
                await pool.query('UPDATE transactions SET status = $1 WHERE id = $2', ['completed', transaction.id]);

                // Update Shipment (Ride)
                if (transaction.shipment_id) {
                    const shipmentResult = await pool.query('SELECT * FROM shipments WHERE id = $1', [transaction.shipment_id]);
                    const shipment = shipmentResult.rows[0];

                    if (shipment) {
                        const driverShare = parseFloat(transaction.net_amount);

                        // Update shipment status and payment info
                        // If it's a 'share' type (we'll check if a column or pattern exists), mark Completed
                        // For KwikLiner, we'll mark deposit as Secured or payment as Paid
                        const isShare = shipment.cargo === 'Passengers' || (shipment.id && shipment.id.includes('SHARE'));

                        let newStatus = shipment.status;
                        if (isShare) newStatus = 'Completed';
                        else if (shipment.status === 'Waiting for Driver Commitment') newStatus = 'Ready for Pickup';

                        await pool.query(
                            `UPDATE shipments SET status = $1, deposit_status = $2, payment_timing = $3 WHERE id = $4`,
                            [newStatus, 'Secured', 'Paid', shipment.id]
                        );

                        // Credit Driver Wallet
                        if (shipment.driver_id) {
                            // Check if wallet exists, if not initialize
                            const walletCheck = await pool.query('SELECT * FROM wallets WHERE user_id = $1', [shipment.driver_id]);
                            if (walletCheck.rows.length === 0) {
                                await pool.query('INSERT INTO wallets (user_id, balance) VALUES ($1, $2)', [shipment.driver_id, driverShare]);
                            } else {
                                await pool.query('UPDATE wallets SET balance = balance + $1 WHERE user_id = $2', [driverShare, shipment.driver_id]);
                            }

                            // Notification
                            if (io) {
                                io.to(`user_${shipment.driver_id}`).emit('notification', {
                                    title: 'Payment Received',
                                    msg: `You received MWK ${driverShare} for Ride #${shipment.id}`,
                                    time: new Date().toISOString()
                                });
                            }
                        }

                        // Notify Room
                        if (io) {
                            io.to(`ride_${shipment.id}`).emit('payment_success', {
                                amount: transaction.gross_amount,
                                transactionRef: chargeId
                            });
                        }
                    }
                }
                await pool.query('COMMIT');
            }
        }

        res.json(verification);

    } catch (err) {
        if (pool) await pool.query('ROLLBACK').catch(() => { });
        console.error("Payment Verification Error:", err);
        res.status(500).json({ error: err.message });
    }
};

/**
 * Handle PayChangu Webhook
 */
exports.handleWebhook = async (req, res) => {
    const crypto = require('crypto');
    const webhookSecret = process.env.PAYCHANGU_WEBHOOK_SECRET;

    try {
        const signature = req.headers['signature'];
        if (!webhookSecret) {
            console.error('❌ Webhook Secret not configured');
            return res.status(500).send('Server Configuration Error');
        }
        if (!signature) {
            console.warn('⚠️ Webhook missing signature');
            return res.status(400).send('Missing signature header');
        }

        const payload = req.rawBody ? req.rawBody.toString() : JSON.stringify(req.body);
        const computedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(payload)
            .digest('hex');

        if (computedSignature !== signature) {
            console.warn('⚠️ Invalid Webhook Signature');
            return res.status(403).send('Invalid webhook request');
        }

        const webhookData = req.body;
        console.log('🔔 Received Webhook:', JSON.stringify(webhookData, null, 2));

        const refId = webhookData.charge_id || webhookData.data?.charge_id;
        const newStatus = webhookData.status || webhookData.data?.status;

        if (refId && newStatus === 'success') {
            const transResult = await pool.query('SELECT * FROM transactions WHERE transaction_ref = $1', [refId]);
            const transaction = transResult.rows[0];

            if (transaction && transaction.status !== 'completed') {
                await pool.query('BEGIN');
                await pool.query('UPDATE transactions SET status = $1 WHERE id = $2', ['completed', transaction.id]);

                if (transaction.shipment_id) {
                    const shipmentResult = await pool.query('SELECT * FROM shipments WHERE id = $1', [transaction.shipment_id]);
                    const shipment = shipmentResult.rows[0];
                    if (shipment) {
                        const driverShare = parseFloat(transaction.net_amount) * 0.95; // 5% fee example
                        await pool.query(
                            'UPDATE shipments SET status = $1, deposit_status = $2 WHERE id = $3',
                            ['Completed', 'Secured', shipment.id]
                        );

                        if (shipment.driver_id) {
                            await pool.query('UPDATE wallets SET balance = balance + $1 WHERE user_id = $2', [driverShare, shipment.driver_id]);
                        }
                    }
                }
                await pool.query('COMMIT');
            }
        }

        res.status(200).send('Webhook processed successfully');
    } catch (error) {
        if (pool) await pool.query('ROLLBACK').catch(() => { });
        console.error('❌ Webhook Error:', error);
        res.status(500).send('Internal Server Error');
    }
};

/**
 * Request Payout
 */
exports.requestPayout = async (req, res) => {
    const { amount, mobileNumber, providerRefId, payoutMethod } = req.body;
    const userId = req.user.id;

    try {
        const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        const user = userResult.rows[0];
        if (!user || user.role !== 'driver') {
            return res.status(403).json({ error: 'Only drivers can request payouts' });
        }

        const walletResult = await pool.query('SELECT balance FROM wallets WHERE user_id = $1', [userId]);
        const wallet = walletResult.rows[0];
        if (!wallet || parseFloat(wallet.balance) < amount) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }

        await pool.query('BEGIN');
        await pool.query('UPDATE wallets SET balance = balance - $1 WHERE user_id = $2', [amount, userId]);

        const chargeId = `PAYOUT-${uuidv4()}`;
        await pool.query(
            'INSERT INTO transactions (user_id, gross_amount, net_amount, commission_amount, type, status, transaction_ref, method) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [userId, amount, amount, 0, 'Payout', 'Pending', chargeId, payoutMethod === 'bank' ? 'Bank Transfer' : 'Mobile Money']
        );

        if (payoutMethod === 'bank') {
            await pool.query('COMMIT');
            return res.json({ status: 'success', message: 'Bank withdrawal requested.', reference: chargeId });
        }

        // Mobile Money Payout
        const operators = await payChanguService.getMobileMoneyOperators();
        const carrierName = providerRefId || user.payout_method || 'AIRTEL';
        const matchedOperator = operators.find(op => op.name?.toUpperCase().includes(carrierName.toUpperCase()));
        const operatorRefId = matchedOperator ? (matchedOperator.ref_id || matchedOperator.id) : operators[0]?.ref_id;

        const payoutResponse = await payChanguService.initiatePayout({
            mobile: mobileNumber,
            amount: amount,
            mobile_money_operator_ref_id: operatorRefId,
            charge_id: chargeId,
            email: user.email,
            first_name: user.name.split(' ')[0],
            last_name: user.name.split(' ')[1] || ''
        });

        await pool.query('UPDATE transactions SET status = $1 WHERE transaction_ref = $2', ['completed', chargeId]);
        await pool.query('COMMIT');

        res.json({ status: 'success', message: 'Payout processed successfully', data: payoutResponse });

    } catch (err) {
        if (pool) await pool.query('ROLLBACK').catch(() => { });
        console.error("Payout Request Error:", err);
        res.status(500).json({ error: err.message });
    }
};

exports.getPlatformBalance = async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
        const balance = await payChanguService.getAccountBalance();
        res.json(balance);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
