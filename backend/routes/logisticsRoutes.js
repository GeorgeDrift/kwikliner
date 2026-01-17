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
router.delete('/fleet/:vehicleId', logisticsController.deleteVehicle);

module.exports = router;
