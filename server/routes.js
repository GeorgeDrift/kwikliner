
const express = require('express');
const router = express.Router();
const { 
  authController, 
  shipperController, 
  driverController, 
  logisticsController, 
  marketController 
} = require('./controllers');

// --- AUTH ROUTES ---
router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);
router.put('/users/:id', authController.updateProfile);

// --- SHIPPER ROUTES ---
router.get('/shipper/:id/loads', shipperController.getMyLoads);
router.post('/shipper/loads', shipperController.postLoad);
router.get('/shipper/drivers', shipperController.getAvailableDrivers);

// --- DRIVER ROUTES ---
router.get('/driver/jobs', driverController.getAvailableJobs);
router.get('/driver/:id/trips', driverController.getMyTrips);

// --- LOGISTICS ROUTES ---
router.get('/logistics/:id/fleet', logisticsController.getFleet);
router.post('/logistics/fleet', logisticsController.addVehicle);
router.delete('/logistics/fleet/:vehicleId', logisticsController.deleteVehicle);

// --- MARKET ROUTES ---
router.get('/products', marketController.getAllProducts);
router.post('/products', marketController.addProduct);
router.put('/products/:id', marketController.updateProduct);
router.delete('/products/:id', marketController.deleteProduct);

module.exports = router;
