const pool = require('../db');
const { notifyUser } = require('../socket');
const marketplaceService = require('./marketplaceService');

const driverService = {
    getJobs: async (driverId) => {
        const result = await pool.query(`
            SELECT *, 
            (bidder_ids @> ARRAY[$1]::UUID[]) as has_bid
            FROM shipments 
            WHERE status IN ('Bidding Open', 'Finding Driver')
            ORDER BY created_at DESC
        `, [driverId]);
        return result.rows;
    },

    bidOnLoad: async (driverId, bidData) => {
        const { loadId, amount } = bidData;

        // Add driver to bidder_ids array in shipments table
        await pool.query(
            'UPDATE shipments SET bidder_ids = array_append(COALESCE(bidder_ids, ARRAY[]::UUID[]), $1) WHERE id = $2',
            [driverId, loadId]
        );

        const result = await pool.query(
            'INSERT INTO bids (load_id, driver_id, amount) VALUES ($1, $2, $3) RETURNING *',
            [loadId, driverId, amount]
        );
        const bid = result.rows[0];

        // Notify shipper about the new bid
        pool.query('SELECT shipper_id FROM shipments WHERE id = $1', [loadId]).then(sRes => {
            if (sRes.rows[0]) {
                const shipperId = sRes.rows[0].shipper_id;
                // Update Shippers Shipment list
                pool.query('SELECT * FROM shipments WHERE shipper_id = $1 ORDER BY created_at DESC', [shipperId]).then(allLoads => {
                    notifyUser(shipperId, 'shipper_shipments_update', allLoads.rows);
                });
                // Update Shippers Bids list
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
            SELECT * FROM shipments 
            WHERE driver_id = $1 
               OR assigned_driver_id = $1 
               OR bidder_ids @> ARRAY[$1]::UUID[]
            ORDER BY created_at DESC
        `, [driverId]);
        return result.rows;
    },

    postVehicleListing: async (driverId, data) => {
        const { driverName, vehicleType, capacity, route, price, images, location } = data;
        const result = await pool.query(`
            INSERT INTO vehicle_listings 
            (driver_id, driver_name, vehicle_type, capacity, route, price, images, location)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `, [driverId, driverName, vehicleType, capacity, route, price, images, location]);

        const listing = result.rows[0];
        // SYNC WITH MARKETPLACE
        await marketplaceService.syncVehicle(listing);

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
            COALESCE(SUM(CAST(REGEXP_REPLACE(capacity, '[^0-9.]', '', 'g') AS FLOAT)), 0) as capacity 
            FROM vehicles WHERE owner_id = $1
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
    }
};

module.exports = driverService;

