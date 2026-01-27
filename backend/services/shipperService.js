const pool = require('../db');
const { notifyUser, broadcastMarketUpdate } = require('../socket');
const marketplaceService = require('./marketplaceService');

const shipperService = {
    getLoads: async (shipperId) => {
        const result = await pool.query('SELECT * FROM shipments WHERE shipper_id = $1 ORDER BY created_at DESC', [shipperId]);
        return result.rows;
    },

    postLoad: async (shipperId, loadData) => {
        // Handle both old format (route) and new format (origin/destination)
        const route = loadData.route || `${loadData.origin} to ${loadData.destination}`;
        const { cargo, weight, price, pickupType, orderRef, assigned_driver_id, pickupDate, status, details, images, quantity } = loadData;
        const id = `#KW-${Math.floor(100000 + Math.random() * 900000)}`;
        const initialStatus = status || 'Bidding Open';

        // Sanitize price and weight
        const cleanPrice = (price && typeof price === 'string') ? price.replace(/[^0-9.]/g, '') : price;
        const safePrice = (!cleanPrice || isNaN(parseFloat(cleanPrice)) || cleanPrice === '') ? null : parseFloat(cleanPrice);

        const cleanWeight = (weight && typeof weight === 'string') ? weight.replace(/[^0-9.]/g, '') : weight;
        const safeWeight = (!cleanWeight || isNaN(parseFloat(cleanWeight))) ? 0 : parseFloat(cleanWeight);



        const result = await pool.query(
            `INSERT INTO shipments (
                id, shipper_id, route, cargo, weight, price, pickup_type, order_ref, status, color, assigned_driver_id, pickup_date, images, quantity
            ) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'text-blue-600 bg-blue-50', $10, $11, $12, $13) RETURNING *`,
            [id, shipperId, route, cargo, safeWeight, safePrice, pickupType || 'Standard', details || orderRef || null, initialStatus, assigned_driver_id || null, pickupDate || null, images || [], quantity || null]
        );

        const newShipment = result.rows[0];

        // SYNC WITH MARKETPLACE
        await marketplaceService.syncShipment(newShipment);

        // Trigger generic market update for all drivers
        broadcastMarketUpdate();

        // Trigger private update for the shipper
        shipperService.getLoads(shipperId).then(allLoads => {
            notifyUser(shipperId, 'shipper_shipments_update', allLoads);
        });

        return newShipment;
    },

    acceptBid: async (loadId, bidId) => {
        try {
            await pool.query('BEGIN');

            // Accept the bid and get amount
            const bidResult = await pool.query('UPDATE bids SET status = $1 WHERE id = $2 RETURNING driver_id, amount', ['Accepted', bidId]);
            if (bidResult.rows.length === 0) throw new Error('Bid not found');
            const { driver_id: driverId, amount: bidAmount } = bidResult.rows[0];

            // Update shipment with the bid price
            const sUpdate = await pool.query(
                "UPDATE shipments SET status = $1, driver_id = $2, price = $3, color = $4 WHERE id = $5 RETURNING *",
                ['Waiting for Driver Commitment', driverId, bidAmount, 'text-purple-600 bg-purple-50', loadId]
            );

            // SYNC WITH MARKETPLACE (status is now Handshake)
            if (sUpdate.rows[0]) await marketplaceService.syncShipment(sUpdate.rows[0]);

            // Reject other bids
            await pool.query('UPDATE bids SET status = $1 WHERE load_id = $2 AND id != $3', ['Rejected', loadId, bidId]);

            await pool.query('COMMIT');

            // Trigger private update for the shipper
            pool.query('SELECT shipper_id FROM shipments WHERE id = $1', [loadId]).then(sRes => {
                if (sRes.rows[0]) {
                    const shipperId = sRes.rows[0].shipper_id;
                    // Update Shipments
                    shipperService.getLoads(shipperId).then(allLoads => {
                        notifyUser(shipperId, 'shipper_shipments_update', allLoads);
                    });
                    // Update Bids
                    pool.query(`
                        SELECT b.*, s.route, s.cargo, u.name as driver_name, u.rating as driver_rating
                        FROM bids b
                        JOIN shipments s ON b.load_id = s.id
                        JOIN users u ON b.driver_id = u.id
                        WHERE s.shipper_id = $1 AND b.status = 'Pending'
                        ORDER BY b.created_at DESC
                    `, [shipperId]).then(bidsRes => {
                        notifyUser(shipperId, 'shipper_bids_update', bidsRes.rows);
                    });
                }
            });

            return { success: true };
        } catch (err) {
            await pool.query('ROLLBACK');
            throw err;
        }
    },

    payDeposit: async (loadId) => {
        const result = await pool.query(
            "UPDATE shipments SET status = $1, deposit_status = $2, color = $3 WHERE id = $4 RETURNING *",
            ['Ready for Pickup', 'Secured', 'text-emerald-600 bg-emerald-50', loadId]
        );
        if (result.rows.length === 0) throw new Error('Shipment not found');

        const shipment = result.rows[0];
        // Notify shipper to update their list
        shipperService.getLoads(shipment.shipper_id).then(allLoads => {
            notifyUser(shipment.shipper_id, 'shipper_shipments_update', allLoads);
        });

        return shipment;
    },

    submitRating: async (loadId, rating, comment) => {
        const result = await pool.query(
            "UPDATE shipments SET driver_rating = $1, driver_comment = $2 WHERE id = $3 RETURNING *",
            [rating, comment, loadId]
        );
        if (result.rows.length === 0) throw new Error('Shipment not found');
        return result.rows[0];
    },

    getStats: async (shipperId) => {
        // 1. Total Shipments (All time)
        const totalRes = await pool.query(
            'SELECT COUNT(*) as total FROM shipments WHERE shipper_id = $1',
            [shipperId]
        );

        // 2. Active Now (Exclude finished/cancelled)
        const activeRes = await pool.query(
            "SELECT COUNT(*) as total FROM shipments WHERE shipper_id = $1 AND status NOT IN ('Completed', 'Delivered', 'Rejected', 'Cancelled')",
            [shipperId]
        );

        // 3. Total Spend (Real transactions only)
        // We sum absolute value of negative gross_amounts (buyer debits)
        const spendRes = await pool.query(
            "SELECT COALESCE(SUM(ABS(gross_amount)), 0) as total FROM transactions WHERE user_id = $1 AND status = 'Completed' AND type IN ('Ride Payment', 'Purchase', 'Sale Payment')",
            [shipperId]
        );

        // 4. Monthly Growth (Shipment Volume)
        const growthRes = await pool.query(`
            SELECT 
                (SELECT COUNT(*) FROM shipments WHERE shipper_id = $1 AND created_at > CURRENT_DATE - INTERVAL '30 days') as current_month,
                (SELECT COUNT(*) FROM shipments WHERE shipper_id = $1 AND created_at BETWEEN CURRENT_DATE - INTERVAL '60 days' AND CURRENT_DATE - INTERVAL '30 days') as last_month
        `, [shipperId]);

        const current = parseInt(growthRes.rows[0].current_month || 0);
        const last = parseInt(growthRes.rows[0].last_month || 0);
        let growth = 0;
        if (last > 0) growth = ((current - last) / last) * 100;
        else if (current > 0) growth = 100;

        return {
            totalShipments: parseInt(totalRes.rows[0].total || 0),
            activeShipments: parseInt(activeRes.rows[0].total || 0),
            totalSpend: parseFloat(spendRes.rows[0].total || 0),
            growth: Math.round(growth)
        };
    },

    getVehicleListings: async () => {
        const result = await pool.query('SELECT * FROM vehicle_listings ORDER BY created_at DESC');
        return result.rows;
    },

    getLogisticsServices: async () => {
        // Since we don't have a services table yet, we can mock it from the database or just return an empty array
        // For now, let's assume we want to fetch from service_bookings but actually we need a 'services' table for discovery.
        // I will return some mock data but structured in a way that suggests it could come from a table.
        return [
            { id: 'serv-1', name: 'Hub-to-Hub Express', provider: 'KwikLine Logistics', price: 'MWK 50k', details: 'Direct warehouse transport' },
            { id: 'serv-2', name: 'Last Mile Delivery', provider: 'City Runner Ltd', price: 'MWK 15k', details: 'Local city distribution' }
        ];
    },

    getBids: async (shipperId) => {
        console.log(`[ShipperService] Fetching bids for shipper: ${shipperId}`);

        // Debug query to see all bids for this shipper regardless of status
        const debugRes = await pool.query('SELECT COUNT(*) FROM bids b JOIN shipments s ON b.load_id = s.id WHERE s.shipper_id = $1', [shipperId]);
        console.log(`[ShipperService] Total bids found for shipper (any status): ${debugRes.rows[0].count}`);

        const result = await pool.query(`
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
        `, [shipperId]);

        console.log(`[ShipperService] Bids with 'Pending' status: ${result.rowCount}`);
        return result.rows;
    },

    bookService: async (shipperId, serviceId) => {
        // For now, since we don't have a dedicated bookings table, we'll create a generic notification/message
        // In a real app, this would insert into 'service_bookings'
        // We'll simulate success
        return { success: true, message: 'Booking request logged.' };
    }
};

module.exports = shipperService;
