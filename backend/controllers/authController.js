const authService = require('../services/authService');

const authController = {
    register: async (req, res) => {
        try {
            const result = await authService.register(req.body);
            res.json(result);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message || 'User registration failed' });
        }
    },

    login: async (req, res) => {
        try {
            const result = await authService.login(req.body);
            res.json(result);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message || 'Login failed' });
        }
    },

    getProfile: async (req, res) => {
        try {
            const user = await authService.getProfile(req.user.id);
            if (!user) return res.status(404).json({ message: 'User not found' });
            res.json(user);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch profile' });
        }
    }
};

module.exports = authController;
