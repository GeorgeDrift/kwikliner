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
    },

    verifyEmail: async (req, res) => {
        try {
            const { token } = req.query;
            console.log('--- VERIFICATION REQUEST RECEIVED ---');
            console.log('Token:', token);
            const result = await authService.verifyEmail(token);
            console.log('Verification Result:', result);
            res.json(result);
        } catch (err) {
            console.error('Verification Error:', err.message);
            res.status(400).json({ error: err.message || 'Email verification failed' });
        }
    },

    resendVerification: async (req, res) => {
        try {
            const { email } = req.body;
            const result = await authService.resendVerification(email);
            res.json(result);
        } catch (err) {
            console.error(err);
            res.status(400).json({ error: err.message || 'Resend verification failed' });
        }
    }
};

module.exports = authController;
