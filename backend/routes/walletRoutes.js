const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const authMiddleware = require('../middleware/auth');

router.get('/:userId', authMiddleware, walletController.getWallet);
router.get('/:userId/transactions', authMiddleware, walletController.getTransactions);
router.get('/banks', authMiddleware, walletController.getSupportedBanks);
router.post('/withdraw', authMiddleware, walletController.withdrawFunds);

module.exports = router;
