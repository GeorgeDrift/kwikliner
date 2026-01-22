const pool = require('../db');

const hardwareService = {
    getProducts: async () => {
        // We join with users to get the seller name automatically
        // We also select the first image from the array as 'image' for frontend compatibility
        const query = `
            SELECT p.id, p.owner_id as "ownerId", p.name, p.description, p.price, 
                   p.category, p.stock_quantity as stock, p.images[1] as image,
                   u.name as seller,
                   p.created_at
            FROM products p
            JOIN users u ON p.owner_id = u.id
            ORDER BY p.created_at DESC
        `;
        const result = await pool.query(query);
        return result.rows;
    },

    addProduct: async (ownerId, productData) => {
        const { name, price, stock, category, image, description } = productData;

        // Ensure image is treated as an array foundation
        const imageArray = image ? [image] : [];

        const result = await pool.query(
            `INSERT INTO products (owner_id, name, price, stock_quantity, category, images, description) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) 
             RETURNING id, owner_id as "ownerId", name, price, stock_quantity as stock, category, images, description`,
            [ownerId, name, price, stock || 0, category, imageArray, description]
        );

        // We need to return the seller name too for immediate UI update, so we fetch the user name
        const userRes = await pool.query('SELECT name FROM users WHERE id = $1', [ownerId]);
        const sellerName = userRes.rows[0]?.name || 'Unknown';

        const row = result.rows[0];
        return {
            ...row,
            image: row.images ? row.images[0] : null,
            seller: sellerName
        };
    },

    updateProduct: async (ownerId, productId, updates) => {
        const { name, price, stock, description } = updates;
        const result = await pool.query(
            `UPDATE products 
             SET name = COALESCE($1, name), 
                 price = COALESCE($2, price), 
                 stock_quantity = COALESCE($3, stock_quantity),
                 description = COALESCE($4, description)
             WHERE id = $5 AND owner_id = $6 
             RETURNING id, owner_id as "ownerId", name, price, stock_quantity as stock, category, images`,
            [name, price, stock, description, productId, ownerId]
        );
        if (result.rows.length === 0) throw new Error('Product not found or unauthorized');

        const row = result.rows[0];
        return {
            ...row,
            image: row.images ? row.images[0] : null
        };
    },

    deleteProduct: async (ownerId, productId) => {
        const result = await pool.query('DELETE FROM products WHERE id = $1 AND owner_id = $2 RETURNING *', [productId, ownerId]);
        if (result.rows.length === 0) throw new Error('Product not found or unauthorized');
        return { success: true };
    },

    processPurchase: async (buyerId, cartItems) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // 1. Calculate Total & Verify Stock for all items first
            let totalAmount = 0;
            const validItems = [];

            for (const item of cartItems) {
                const prodRes = await client.query('SELECT * FROM products WHERE id = $1 FOR UPDATE', [item.id]);
                if (prodRes.rows.length === 0) throw new Error(`Product ${item.name} not found`);

                const product = prodRes.rows[0];
                if (product.stock_quantity < item.quantity) {
                    throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock_quantity}`);
                }

                totalAmount += Number(product.price) * item.quantity;
                validItems.push({ ...product, requestQty: item.quantity });
            }

            // 2. Check Buyer Wallet
            const buyerWalletRes = await client.query('SELECT * FROM wallets WHERE user_id = $1 FOR UPDATE', [buyerId]);
            if (buyerWalletRes.rows.length === 0) throw new Error('Buyer wallet not found');

            const buyerWallet = buyerWalletRes.rows[0];
            if (Number(buyerWallet.balance) < totalAmount) {
                throw new Error('Insufficient funds in wallet');
            }

            // 3. Process Transactions (Deduct Buyer, Credit Sellers, Update Stock)
            // Deduct total from Buyer
            await client.query('UPDATE wallets SET balance = balance - $1 WHERE user_id = $2', [totalAmount, buyerId]);

            const transactionRef = `TRX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

            for (const item of validItems) {
                const lineTotal = Number(item.price) * item.requestQty;
                const commission = lineTotal * 0.05; // 5% Commission
                const sellerNet = lineTotal - commission;

                // Credit Seller
                await client.query('UPDATE wallets SET balance = balance + $1 WHERE user_id = $2', [sellerNet, item.owner_id]);

                // Update Stock
                await client.query('UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2', [item.requestQty, item.id]);

                // Record Transaction
                await client.query(
                    `INSERT INTO transactions 
                    (user_id, product_id, gross_amount, commission_amount, net_amount, type, status, transaction_ref)
                    VALUES ($1, $2, $3, $4, $5, 'Sale', 'COMPLETED', $6)`,
                    [item.owner_id, item.id, lineTotal, commission, sellerNet, transactionRef]
                );
            }

            // Record Buyer Debit Transaction
            await client.query(
                `INSERT INTO transactions 
                (user_id, gross_amount, commission_amount, net_amount, type, status, transaction_ref, method)
                VALUES ($1, $2, 0, $2, 'Purchase', 'COMPLETED', $3, 'Wallet')`,
                [buyerId, -totalAmount, transactionRef]
            );

            await client.query('COMMIT');
            return { success: true, transactionRef };
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    }
};

module.exports = hardwareService;
