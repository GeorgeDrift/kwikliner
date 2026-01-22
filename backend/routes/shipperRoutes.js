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
router.post('/rate', shipperController.submitRating);
router.get('/stats', shipperController.getStats);
router.get('/bids', shipperController.getBids);
router.get('/vehicle-listings', shipperController.getVehicleListings);
router.get('/logistics-services', shipperController.getLogisticsServices);
router.post('/services/book', shipperController.bookService);

module.exports = router;
