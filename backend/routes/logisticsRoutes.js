const express = require('express');
const router = express.Router();
const logisticsController = require('../controllers/logisticsController');
const authMiddleware = require('../middleware/auth');
const logisticsMiddleware = require('../middleware/logisticsMiddleware');

// All routes require auth and logistics role
router.use(authMiddleware);
router.use(logisticsMiddleware);

router.get('/fleet', logisticsController.getFleet);
router.post('/fleet', logisticsController.addVehicle);
router.put('/fleet/:vehicleId', logisticsController.updateVehicle);
router.delete('/fleet/:vehicleId', logisticsController.deleteVehicle);
router.get('/stats', logisticsController.getStats);
router.get('/drivers', logisticsController.getDrivers);
router.get('/listings', logisticsController.getListings);
router.delete('/listings/:id', logisticsController.deleteListing);
router.get('/analytics', logisticsController.getRevenueAnalytics);
router.get('/trips', logisticsController.getTrips);

module.exports = router;
