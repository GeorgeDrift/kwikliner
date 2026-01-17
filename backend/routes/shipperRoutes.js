const express = require('express');
const router = express.Router();
const shipperController = require('../controllers/shipperController');
const authMiddleware = require('../middleware/auth');
const shipperMiddleware = require('../middleware/shipperMiddleware');

// All routes require auth and shipper role
router.use(authMiddleware);
router.use(shipperMiddleware);

router.get('/loads', shipperController.getLoads);
router.post('/loads', shipperController.postLoad);
router.post('/bids/accept', shipperController.acceptBid);
router.post('/loads/:loadId/pay', shipperController.payDeposit);

module.exports = router;
