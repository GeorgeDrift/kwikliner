const socketIo = require('socket.io');

let io;

const init = (server) => {
    io = socketIo(server, {
        cors: {
            origin: '*', // Allow all origins for dev simplicity
            methods: ['GET', 'POST']
        }
    });

    console.log('Socket.IO initialized');

    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        // Allow users to join their own private room
        socket.on('join_room', (userId) => {
            const room = `user_${userId}`;
            socket.join(room);
            console.log(`Socket ${socket.id} joined room: ${room}`);
        });

        socket.on('request_market_data', async () => {
            try {
                const result = await require('./db').query(`
                    SELECT * FROM marketplace_items 
                    WHERE status = 'Active' 
                    ORDER BY created_at DESC LIMIT 100
                `);

                // Map to frontend expected format
                const mapped = result.rows.map(item => ({
                    id: item.external_id || item.id,
                    dbId: item.id,
                    name: item.title,
                    cat: item.type,
                    type: item.type === 'Cargo' ? 'Shipment' : 'Transport',
                    price: parseFloat(item.price) || 0,
                    priceStr: item.price_str,
                    location: item.location,
                    images: item.images || [],
                    img: (item.images && item.images.length > 0) ? item.images[0] : '',
                    provider: item.provider_name,
                    details: item.description,
                    ownerId: item.owner_id,
                    weight: item.metadata?.weight,
                    quantity: item.metadata?.quantity,
                    capacity: item.metadata?.capacity
                }));

                socket.emit('market_data_update', mapped);
            } catch (err) {
                console.error('Socket market fetch error:', err);
            }
        });

        // Specific request for a shipper's own shipments
        socket.on('request_shipper_shipments', async (userId) => {
            try {
                const result = await require('./db').query(
                    'SELECT * FROM shipments WHERE shipper_id = $1 ORDER BY created_at DESC',
                    [userId]
                );
                socket.emit('shipper_shipments_update', result.rows);
            } catch (err) {
                console.error('Socket shipper shipments fetch error:', err);
            }
        });

        // Specific request for a shipper's pending bids
        socket.on('request_shipper_bids', async (userId) => {
            try {
                const result = await require('./db').query(`
                    SELECT b.*, s.route, s.cargo, u.name as driver_name, u.rating as driver_rating
                    FROM bids b
                    JOIN shipments s ON b.load_id = s.id
                    JOIN users u ON b.driver_id = u.id
                    WHERE s.shipper_id = $1 AND b.status = 'Pending'
                    ORDER BY b.created_at DESC
                `, [userId]);
                socket.emit('shipper_bids_update', result.rows);
            } catch (err) {
                console.error('Socket shipper bids fetch error:', err);
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });

    return io;
};

// Helper for broadcasting to a specific user
const notifyUser = (userId, event, data) => {
    if (io) {
        io.to(`user_${userId}`).emit(event, data);
    }
};

// Helper for broadcasting market data to everyone
const broadcastMarketUpdate = async () => {
    if (!io) return;
    try {
        const result = await require('./db').query(`
            SELECT * FROM marketplace_items 
            WHERE status = 'Active' 
            ORDER BY created_at DESC LIMIT 100
        `);

        const mapped = result.rows.map(item => ({
            id: item.external_id || item.id,
            dbId: item.id,
            name: item.title,
            cat: item.type,
            type: item.type === 'Cargo' ? 'Shipment' : 'Transport',
            price: parseFloat(item.price) || 0,
            priceStr: item.price_str,
            location: item.location,
            images: item.images || [],
            img: (item.images && item.images.length > 0) ? item.images[0] : '',
            provider: item.provider_name,
            details: item.description,
            ownerId: item.owner_id,
            weight: item.metadata?.weight,
            quantity: item.metadata?.quantity,
            capacity: item.metadata?.capacity
        }));

        io.emit('market_data_update', mapped);
        console.log(`[Socket] Broadcasted marketplace update: ${mapped.length} items`);
    } catch (err) {
        console.error('[Socket] Broadcast marketplace error:', err);
    }
};

const getIo = () => {
    if (!io) {
        throw new Error('Socket.IO not initialized!');
    }
    return io;
};

module.exports = { init, getIo, notifyUser, broadcastMarketUpdate };
