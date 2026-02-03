const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const authMiddleware = require('../middleware/auth');
const driverMiddleware = require('../middleware/driverMiddleware');

// All routes require auth and driver/logistics role
router.use(authMiddleware);
router.use(driverMiddleware);

router.get('/stats', driverController.getStats);
router.get('/jobs', driverController.getJobs);
router.post('/availability', driverController.postVehicleListing);
router.put('/availability/:listingId', driverController.updateVehicleListing);
router.post('/bids', driverController.bidOnLoad);
router.post('/jobs/commit', driverController.commitToJob);
router.post('/jobs/status', driverController.updateShipmentStatus);
router.get('/trips', driverController.getTrips);
router.get('/listings', driverController.getListings);
router.get('/fleet', driverController.getFleet);
router.post('/jobs/:loadId/trigger-deposit', driverController.triggerDeposit);
router.delete('/listings/:id', driverController.deleteVehicleListing);

module.exports = router;
