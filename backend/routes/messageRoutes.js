const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// Get all conversations for the authenticated user
router.get('/conversations', messageController.getConversations);

// Get messages with a specific user
router.get('/:otherUserId', messageController.getMessages);

// Send a message
router.post('/send', messageController.sendMessage);

// Mark a specific message as read
router.put('/:messageId/read', messageController.markAsRead);

// Mark all messages from a user as read
router.put('/:otherUserId/read-all', messageController.markAllAsRead);

module.exports = router;
