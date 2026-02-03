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
            console.log(`[Socket] User ${userId} joined room: ${room}`);
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
                    // Use specific category from metadata if available (for Hardware), otherwise fallback to DB type
                    cat: item.type,
                    type: item.type,
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
                    capacity: item.metadata?.capacity,
                    manufacturer: item.metadata?.manufacturer,
                    model: item.metadata?.model,
                    vehicleType: item.metadata?.vehicle_type,
                    route: item.metadata?.route
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
                // Modified query to handle missing user rating column
                // We'll join with vehicle_listings or use default if not available
                const result = await require('./db').query(`
                    SELECT 
                        b.*, 
                        s.route, 
                        s.cargo, 
                        u.name as driver_name,
                        COALESCE(vl.rating, 5.0) as driver_rating,
                        COALESCE(vl.vehicle_type, 'Truck') as vehicle_type
                    FROM bids b
                    JOIN shipments s ON b.load_id = s.id
                    JOIN users u ON b.driver_id = u.id
                    LEFT JOIN (
                        SELECT DISTINCT ON (driver_id) driver_id, rating, vehicle_type 
                        FROM vehicle_listings 
                        ORDER BY driver_id, created_at DESC
                    ) vl ON b.driver_id = vl.driver_id
                    WHERE s.shipper_id = $1 AND b.status = 'Pending'
                    ORDER BY b.created_at DESC
                `, [userId]);
                socket.emit('shipper_bids_update', result.rows);
            } catch (err) {
                console.error('Socket shipper bids fetch error:', err);
            }
        });

        // Dashboard data request - Stream data as it becomes available
        socket.on('request_dashboard_data', async (userId) => {
            console.log(`[Socket] Dashboard data requested for user ${userId}`);

            try {
                const logisticsService = require('./services/logisticsService');
                const pool = require('./db');

                // Execute all queries in parallel and emit as each completes
                Promise.all([
                    // Stats data
                    logisticsService.getStats(userId)
                        .then(stats => {
                            socket.emit('stats_data', stats);
                            console.log(`[Socket] Emitted stats_data for user ${userId}`);
                        })
                        .catch(err => console.error('Stats query error:', err)),

                    // Fleet data
                    logisticsService.getFleet(userId)
                        .then(fleet => {
                            socket.emit('fleet_data', fleet);
                            console.log(`[Socket] Emitted fleet_data: ${fleet.length} vehicles`);
                        })
                        .catch(err => console.error('Fleet query error:', err)),

                    // Drivers data
                    logisticsService.getDrivers(userId)
                        .then(drivers => {
                            socket.emit('drivers_data', drivers);
                            console.log(`[Socket] Emitted drivers_data: ${drivers.length} drivers`);
                        })
                        .catch(err => console.error('Drivers query error:', err)),

                    // Listings data
                    logisticsService.getListings(userId)
                        .then(listings => {
                            socket.emit('listings_data', listings);
                            console.log(`[Socket] Emitted listings_data: ${listings.length} listings`);
                        })
                        .catch(err => console.error('Listings query error:', err)),

                    // Analytics data
                    logisticsService.getRevenueAnalytics(userId)
                        .then(analytics => {
                            socket.emit('analytics_data', analytics);
                            console.log(`[Socket] Emitted analytics_data`);
                        })
                        .catch(err => console.error('Analytics query error:', err)),

                    // Wallet data
                    pool.query('SELECT * FROM wallets WHERE user_id = $1', [userId])
                        .then(result => {
                            socket.emit('wallet_data', result.rows[0] || { balance: 0, currency: 'MWK' });
                            console.log(`[Socket] Emitted wallet_data`);
                        })
                        .catch(err => console.error('Wallet query error:', err)),

                    // Transactions data
                    pool.query('SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50', [userId])
                        .then(result => {
                            socket.emit('transactions_data', result.rows);
                            console.log(`[Socket] Emitted transactions_data: ${result.rows.length} transactions`);
                        })
                        .catch(err => console.error('Transactions query error:', err)),

                    // Trips data
                    logisticsService.getMyTrips(userId)
                        .then(trips => {
                            socket.emit('trips_data', trips.map(j => ({
                                ...j,
                                assignedDriver: j.assigned_driver_id || null
                            })));
                            console.log(`[Socket] Emitted trips_data: ${trips.length} trips`);
                        })
                        .catch(err => console.error('Trips query error:', err))
                ]).then(() => {
                    // Signal that all data has been sent
                    socket.emit('dashboard_data_complete');
                    console.log(`[Socket] Dashboard data streaming complete for user ${userId}`);
                }).catch(err => {
                    console.error('[Socket] Dashboard data error:', err);
                    socket.emit('dashboard_data_error', { error: err.message });
                });

            } catch (err) {
                console.error('[Socket] Dashboard request error:', err);
                socket.emit('dashboard_data_error', { error: err.message });
            }
        });

        // Message events
        socket.on('send_message', async (data) => {
            try {
                const { receiverId, message, senderId, senderName } = data;

                // Broadcast to receiver
                io.to(`user_${receiverId}`).emit('new_message', {
                    senderId,
                    senderName,
                    message,
                    timestamp: new Date().toISOString()
                });

                console.log(`[Socket] Message sent from ${senderId} to ${receiverId}`);
            } catch (err) {
                console.error('Socket send message error:', err);
            }
        });

        socket.on('typing', (data) => {
            const { receiverId, senderId, senderName } = data;
            io.to(`user_${receiverId}`).emit('user_typing', {
                senderId,
                senderName
            });
        });

        socket.on('stop_typing', (data) => {
            const { receiverId, senderId } = data;
            io.to(`user_${receiverId}`).emit('user_stop_typing', {
                senderId
            });
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
            type: item.type,
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
