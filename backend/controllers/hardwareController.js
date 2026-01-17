const hardwareService = require('../services/hardwareService');

const hardwareController = {
    getProducts: async (req, res) => {
        try {
            const products = await hardwareService.getProducts();
            res.json(products);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch products' });
        }
    },

    addProduct: async (req, res) => {
        try {
            const product = await hardwareService.addProduct(req.user.id, req.body);
            res.json(product);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to add product' });
        }
    },

    updateProduct: async (req, res) => {
        try {
            const product = await hardwareService.updateProduct(req.user.id, req.params.id, req.body);
            res.json(product);
        } catch (err) {
            res.status(500).json({ error: err.message || 'Update failed' });
        }
    },

    deleteProduct: async (req, res) => {
        try {
            await hardwareService.deleteProduct(req.user.id, req.params.id);
            res.json({ success: true });
        } catch (err) {
            res.status(500).json({ error: err.message || 'Delete failed' });
        }
    }
};

module.exports = hardwareController;
