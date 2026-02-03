const pool = require('../db');

const messageService = {
    // Get all conversations for a user
    getConversations: async (userId) => {
        const result = await pool.query(`
            WITH latest_messages AS (
                SELECT DISTINCT ON (LEAST(sender_id, receiver_id), GREATEST(sender_id, receiver_id))
                    id,
                    sender_id,
                    receiver_id,
                    message,
                    is_read,
                    created_at,
                    CASE 
                        WHEN sender_id = $1 THEN receiver_id
                        ELSE sender_id
                    END as other_user_id
                FROM messages
                WHERE sender_id = $1 OR receiver_id = $1
                ORDER BY LEAST(sender_id, receiver_id), GREATEST(sender_id, receiver_id), created_at DESC
            )
            SELECT 
                lm.*,
                u.name as other_user_name,
                u.role as other_user_role,
                (SELECT COUNT(*) FROM messages 
                 WHERE receiver_id = $1 
                 AND sender_id = lm.other_user_id 
                 AND is_read = false) as unread_count
            FROM latest_messages lm
            JOIN users u ON u.id = lm.other_user_id
            ORDER BY lm.created_at DESC
        `, [userId]);

        return result.rows;
    },

    // Get messages between two users
    getMessages: async (userId, otherUserId) => {
        const result = await pool.query(`
            SELECT 
                m.*,
                sender.name as sender_name,
                receiver.name as receiver_name
            FROM messages m
            JOIN users sender ON sender.id = m.sender_id
            JOIN users receiver ON receiver.id = m.receiver_id
            WHERE (m.sender_id = $1 AND m.receiver_id = $2)
               OR (m.sender_id = $2 AND m.receiver_id = $1)
            ORDER BY m.created_at ASC
        `, [userId, otherUserId]);

        return result.rows;
    },

    // Send a message
    sendMessage: async (senderId, receiverId, messageText) => {
        const result = await pool.query(`
            INSERT INTO messages (sender_id, receiver_id, message)
            VALUES ($1, $2, $3)
            RETURNING *
        `, [senderId, receiverId, messageText]);

        return result.rows[0];
    },

    // Mark message as read
    markAsRead: async (messageId, userId) => {
        const result = await pool.query(`
            UPDATE messages
            SET is_read = true
            WHERE id = $1 AND receiver_id = $2
            RETURNING *
        `, [messageId, userId]);

        return result.rows[0];
    },

    // Mark all messages from a user as read
    markAllAsRead: async (userId, otherUserId) => {
        const result = await pool.query(`
            UPDATE messages
            SET is_read = true
            WHERE receiver_id = $1 AND sender_id = $2 AND is_read = false
            RETURNING *
        `, [userId, otherUserId]);

        return result.rows;
    }
};

module.exports = messageService;
