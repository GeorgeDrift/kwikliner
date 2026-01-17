const express = require('express');
const router = express.Router();
const hardwareController = require('../controllers/hardwareController');
const authMiddleware = require('../middleware/auth');
const hardwareMiddleware = require('../middleware/hardwareMiddleware');

// Public route to get products
router.get('/', hardwareController.getProducts);

// Protected routes for adding/editing products
router.post('/', authMiddleware, hardwareMiddleware, hardwareController.addProduct);
router.put('/:id', authMiddleware, hardwareMiddleware, hardwareController.updateProduct);
router.delete('/:id', authMiddleware, hardwareMiddleware, hardwareController.deleteProduct);

module.exports = router;
