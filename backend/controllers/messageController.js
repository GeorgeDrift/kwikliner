const messageService = require('../services/messageService');

const messageController = {
    // Get all conversations for authenticated user
    getConversations: async (req, res) => {
        try {
            const conversations = await messageService.getConversations(req.user.id);
            res.json(conversations);
        } catch (err) {
            console.error('Error fetching conversations:', err);
            res.status(500).json({ error: 'Failed to fetch conversations' });
        }
    },

    // Get messages with a specific user
    getMessages: async (req, res) => {
        try {
            const { otherUserId } = req.params;
            const messages = await messageService.getMessages(req.user.id, otherUserId);
            res.json(messages);
        } catch (err) {
            console.error('Error fetching messages:', err);
            res.status(500).json({ error: 'Failed to fetch messages' });
        }
    },

    // Send a message
    sendMessage: async (req, res) => {
        try {
            const { receiverId, message } = req.body;

            if (!receiverId || !message) {
                return res.status(400).json({ error: 'Receiver ID and message are required' });
            }

            const newMessage = await messageService.sendMessage(req.user.id, receiverId, message);

            // Emit socket event for real-time delivery
            const io = require('../socket').getIo();
            io.to(`user_${receiverId}`).emit('new_message', {
                ...newMessage,
                sender_name: req.user.name
            });

            res.json(newMessage);
        } catch (err) {
            console.error('Error sending message:', err);
            res.status(500).json({ error: 'Failed to send message' });
        }
    },

    // Mark message as read
    markAsRead: async (req, res) => {
        try {
            const { messageId } = req.params;
            const message = await messageService.markAsRead(messageId, req.user.id);

            if (!message) {
                return res.status(404).json({ error: 'Message not found' });
            }

            // Notify sender that message was read
            const io = require('../socket').getIo();
            io.to(`user_${message.sender_id}`).emit('message_read', {
                messageId: message.id,
                readBy: req.user.id
            });

            res.json(message);
        } catch (err) {
            console.error('Error marking message as read:', err);
            res.status(500).json({ error: 'Failed to mark message as read' });
        }
    },

    // Mark all messages from a user as read
    markAllAsRead: async (req, res) => {
        try {
            const { otherUserId } = req.params;
            const messages = await messageService.markAllAsRead(req.user.id, otherUserId);
            res.json(messages);
        } catch (err) {
            console.error('Error marking messages as read:', err);
            res.status(500).json({ error: 'Failed to mark messages as read' });
        }
    }
};

module.exports = messageController;
