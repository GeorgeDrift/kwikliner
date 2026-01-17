const pool = require('../db');

const hardwareService = {
    getProducts: async () => {
        const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
        return result.rows;
    },

    addProduct: async (ownerId, productData) => {
        const { name, price, stock, category, image, priceStr } = productData;
        const result = await pool.query(
            `INSERT INTO products (owner_id, name, price, stock, category, image, price_str, seller) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, (SELECT name FROM users WHERE id = $1)) RETURNING *`,
            [ownerId, name, price, stock, category, image, priceStr]
        );
        return result.rows[0];
    },

    updateProduct: async (ownerId, productId, updates) => {
        const { name, price, stock } = updates;
        const result = await pool.query(
            'UPDATE products SET name = $1, price = $2, stock = $3 WHERE id = $4 AND owner_id = $5 RETURNING *',
            [name, price, stock, productId, ownerId]
        );
        if (result.rows.length === 0) throw new Error('Product not found or unauthorized');
        return result.rows[0];
    },

    deleteProduct: async (ownerId, productId) => {
        const result = await pool.query('DELETE FROM products WHERE id = $1 AND owner_id = $2 RETURNING *', [productId, ownerId]);
        if (result.rows.length === 0) throw new Error('Product not found or unauthorized');
        return { success: true };
    }
};

module.exports = hardwareService;
