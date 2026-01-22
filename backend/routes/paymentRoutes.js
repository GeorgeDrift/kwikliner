const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/auth');

router.get('/operators', authMiddleware, paymentController.getOperators);
router.post('/initiate', authMiddleware, paymentController.initiatePayment);
router.get('/verify/:chargeId', authMiddleware, paymentController.verifyPayment);
router.post('/webhook', paymentController.handleWebhook);
router.get('/balance', authMiddleware, paymentController.getPlatformBalance);
router.post('/payout', authMiddleware, paymentController.requestPayout);

module.exports = router;
