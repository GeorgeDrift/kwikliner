const router = require('express').Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/adminMiddleware');

// Protect all admin routes
router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/stats', adminController.getDashboardStats);
router.get('/users', adminController.getUsers);
router.put('/users/:id/status', adminController.toggleUserStatus);

module.exports = router;
