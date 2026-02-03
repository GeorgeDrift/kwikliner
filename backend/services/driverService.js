const pool = require('../db');
const { notifyUser } = require('../socket');
const marketplaceService = require('./marketplaceService');

const driverService = {
    getJobs: async (driverId) => {
        const result = await pool.query(`
            SELECT s.*, 
            (s.bidder_ids @> ARRAY[$1]::UUID[]) as has_bid,
            b.amount as my_bid_amount
            FROM shipments s
            LEFT JOIN bids b ON s.id = b.load_id AND b.driver_id = $1
            WHERE s.status IN ('Bidding Open', 'Finding Driver')
            ORDER BY s.created_at DESC
        `, [driverId]);
        return result.rows;
    },

    bidOnLoad: async (driverId, bidData) => {
        const { loadId, amount } = bidData;

        // Sanitize amount (remove "MWK ", commas, etc.)
        const cleanAmount = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.]/g, '')) : amount;

        console.log(`[DriverService] Placing bid on ${loadId} by ${driverId}, raw amount: ${amount}, sanitized: ${cleanAmount}`);

        if (isNaN(cleanAmount)) {
            console.error(`[DriverService] Invalid bid amount: ${amount}`);
            throw new Error('Invalid bid amount');
        }

        // Add driver to bidder_ids array in shipments table
        await pool.query(
            'UPDATE shipments SET bidder_ids = array_append(COALESCE(bidder_ids, ARRAY[]::UUID[]), $1) WHERE id = $2',
            [driverId, loadId]
        );

        const result = await pool.query(
            'INSERT INTO bids (load_id, driver_id, amount) VALUES ($1, $2, $3) RETURNING *',
            [loadId, driverId, cleanAmount]
        );
        const bid = result.rows[0];

        // Notify shipper about the new bid
        pool.query('SELECT shipper_id FROM shipments WHERE id = $1', [loadId]).then(sRes => {
            if (sRes.rows[0]) {
                const shipperId = sRes.rows[0].shipper_id;

                // 1. Update Shippers Shipment list (Private Room)
                pool.query('SELECT * FROM shipments WHERE shipper_id = $1 ORDER BY created_at DESC', [shipperId]).then(allLoads => {
                    notifyUser(shipperId, 'shipper_shipments_update', allLoads.rows);
                });

                // 2. Update Shippers Bids list (Private Room)
                // Ensure we select fresh data including the new bid
                pool.query(`
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
                `, [shipperId]).then(bidsRes => {
                    notifyUser(shipperId, 'shipper_bids_update', bidsRes.rows);
                });
            }
        });

        console.log(`[DriverService] Bid placed on ${loadId} by ${driverId}, amount: ${amount}`);
        return bid;
    },

    commitToJob: async (loadId, decision) => {
        const status = decision === 'COMMIT' ? 'Pending Deposit' : 'Finding Driver';
        const color = decision === 'COMMIT' ? 'text-amber-600 bg-amber-50' : 'text-blue-600 bg-blue-50';

        const result = await pool.query(
            'UPDATE shipments SET status = $1, color = $2 WHERE id = $3 RETURNING *',
            [status, color, loadId]
        );

        if (result.rows.length === 0) throw new Error('Shipment not found');
        const shipment = result.rows[0];

        // Notify shipper
        pool.query('SELECT * FROM shipments WHERE shipper_id = $1 ORDER BY created_at DESC', [shipment.shipper_id]).then(allLoads => {
            notifyUser(shipment.shipper_id, 'shipper_shipments_update', allLoads.rows);
        });

        return shipment;
    },

    updateShipmentStatus: async (loadId, status) => {
        const colorMap = {
            'In Transit': 'text-blue-500 bg-blue-50',
            'Delivered': 'text-emerald-600 bg-emerald-50',
            'Active (Waiting Delivery)': 'text-emerald-600 bg-emerald-50'
        };

        const result = await pool.query(
            'UPDATE shipments SET status = $1, color = $2 WHERE id = $3 RETURNING *',
            [status, colorMap[status] || 'text-slate-600 bg-slate-50', loadId]
        );

        if (result.rows.length === 0) throw new Error('Shipment not found');
        const shipment = result.rows[0];

        // Notify shipper
        pool.query('SELECT * FROM shipments WHERE shipper_id = $1 ORDER BY created_at DESC', [shipment.shipper_id]).then(allLoads => {
            notifyUser(shipment.shipper_id, 'shipper_shipments_update', allLoads.rows);
        });

        return shipment;
    },

    getMyTrips: async (driverId) => {
        const result = await pool.query(`
            SELECT s.*, b.amount as my_bid_amount
            FROM shipments s
            LEFT JOIN bids b ON s.id = b.load_id AND b.driver_id = $1
            WHERE s.driver_id = $1 
               OR s.assigned_driver_id = $1 
               OR s.bidder_ids @> ARRAY[$1]::UUID[]
            ORDER BY s.created_at DESC
        `, [driverId]);
        return result.rows;
    },

    postVehicleListing: async (driverId, data) => {
        const { driverName, vehicleType, capacity, route, price, images, location, manufacturer, model, fleetId } = data;

        console.log(`[DriverService] Creating listing for ${driverName}, fleetId: ${fleetId}`);
        console.log(`[DriverService] Images provided: ${Array.isArray(images) ? images.length : 'none'}`);

        // 1. Save the listing
        const result = await pool.query(`
            INSERT INTO vehicle_listings 
            (driver_id, driver_name, vehicle_type, capacity, route, price, images, location, manufacturer, model)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *
        `, [driverId, driverName, vehicleType, capacity, route, price, images, location, manufacturer, model]);

        const listing = result.rows[0];

        // 2. Sync with Fleet if provided
        if (fleetId) {
            console.log(`[DriverService] Syncing with fleet vehicle: ${fleetId}`);
            try {
                const fleetUpdate = await pool.query(
                    'UPDATE my_fleet SET status = $1, images = $2 WHERE id = $3 RETURNING *',
                    ['Available', images || [], fleetId]
                );
                console.log(`[DriverService] Fleet sync result rows: ${fleetUpdate.rows.length}`);
            } catch (syncErr) {
                console.error(`[DriverService] Fleet sync FAILED:`, syncErr);
            }
        }

        // 3. SYNC WITH MARKETPLACE
        await marketplaceService.syncVehicle(listing);

        // 4. BROADCAST TO ALL CLIENTS
        const { broadcastMarketUpdate } = require('../socket');
        broadcastMarketUpdate();

        return listing;
    },

    updateVehicleListing: async (listingId, data) => {
        const { vehicleType, capacity, route, price, images, location, manufacturer, model } = data;

        const result = await pool.query(`
            UPDATE vehicle_listings 
            SET vehicle_type = $1, capacity = $2, route = $3, price = $4, images = $5, 
                location = $6, manufacturer = $7, model = $8
            WHERE id = $9
            RETURNING *
        `, [vehicleType, capacity, route, price, images, location, manufacturer, model, listingId]);

        if (result.rows.length === 0) throw new Error('Listing not found');
        const listing = result.rows[0];

        // Sync with marketplace
        await marketplaceService.syncVehicle(listing);

        // Broadcast
        const { broadcastMarketUpdate } = require('../socket');
        broadcastMarketUpdate();

        return listing;
    },

    getStats: async (driverId) => {
        // 1. Total History/Orders
        const historyRes = await pool.query(
            'SELECT COUNT(*) as total FROM shipments WHERE (driver_id = $1 OR assigned_driver_id = $1)',
            [driverId]
        );

        // 2. Wallet & Lifetime Earnings
        const walletRes = await pool.query(`
            SELECT balance, currency, 
            (SELECT COALESCE(SUM(net_amount), 0) FROM transactions WHERE user_id = $1 AND type != 'Withdrawal') as total_earned
            FROM wallets WHERE user_id = $1
        `, [driverId]);

        // 3. Fleet Capacity
        const fleetRes = await pool.query(`
            SELECT COUNT(*) as count, 
            COALESCE(SUM(CAST(NULLIF(REGEXP_REPLACE(capacity, '[^0-9.]', '', 'g'), '') AS FLOAT)), 0) as capacity 
            FROM my_fleet WHERE owner_id = $1
        `, [driverId]);

        // 4. Market Jobs Count (Aligned with centralized marketplace)
        const marketRes = await pool.query(
            "SELECT COUNT(*) as total FROM marketplace_items WHERE type = 'Cargo' AND status = 'Active'"
        );

        // 5. Monthly Revenue for Current Year
        const revenueRes = await pool.query(`
            SELECT TO_CHAR(created_at, 'Mon') as month, SUM(net_amount) as amount 
            FROM transactions 
            WHERE user_id = $1 AND type != 'Withdrawal' 
              AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
            GROUP BY month, EXTRACT(MONTH FROM created_at)
            ORDER BY EXTRACT(MONTH FROM created_at)
        `, [driverId]);

        return {
            totalOrders: parseInt(historyRes.rows[0].total),
            wallet: walletRes.rows[0] || { balance: 0, currency: 'MWK', total_earned: 0 },
            fleet: {
                count: parseInt(fleetRes.rows[0].count),
                capacity: parseFloat(fleetRes.rows[0].capacity)
            },
            marketJobs: parseInt(marketRes.rows[0].total),
            revenue: revenueRes.rows
        };
    },
    getMyListings: async (driverId) => {
        const result = await pool.query(
            'SELECT * FROM vehicle_listings WHERE driver_id = $1 ORDER BY created_at DESC',
            [driverId]
        );
        return result.rows;
    },
    getFleet: async (ownerId) => {
        const result = await pool.query('SELECT * FROM my_fleet WHERE owner_id = $1 ORDER BY created_at DESC', [ownerId]);
        return result.rows;
    },
    deleteVehicleListing: async (listingId, driverId) => {
        const result = await pool.query(
            'DELETE FROM vehicle_listings WHERE id = $1 AND driver_id = $2 RETURNING *',
            [listingId, driverId]
        );
        if (result.rows.length === 0) throw new Error('Listing not found or access denied');

        // Remove from marketplace
        await marketplaceService.removeItem(listingId);

        // Broadcast
        const { broadcastMarketUpdate } = require('../socket');
        broadcastMarketUpdate();

        return result.rows[0];
    },
    triggerDepositReminder: async (loadId) => {
        const result = await pool.query('SELECT shipper_id, route, cargo FROM shipments WHERE id = $1', [loadId]);
        if (result.rows.length === 0) throw new Error('Shipment not found');
        const { shipper_id, route, cargo } = result.rows[0];

        notifyUser(shipper_id, 'deposit_reminder', {
            shipmentId: loadId,
            message: `Driver is requesting 50% deposit for ${cargo} (${route})`,
            type: 'warning'
        });

        return { success: true };
    }
};

module.exports = driverService;

