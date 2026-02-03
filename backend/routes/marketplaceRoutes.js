const express = require('express');
const router = express.Router();
const marketplaceController = require('../controllers/marketplaceController');

// Public endpoints - no auth required
router.get('/cargo', marketplaceController.getAllCargoListings);
router.get('/products', marketplaceController.getAllProducts);
router.get('/vehicles', marketplaceController.getAllVehicleListings);
router.get('/services', marketplaceController.getAllLogisticsServices);
router.get('/all', marketplaceController.getAllMarketplaceItems);

module.exports = router;
