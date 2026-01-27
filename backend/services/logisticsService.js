const pool = require('../db');

const logisticsService = {
    getFleet: async (ownerId) => {
        const result = await pool.query('SELECT * FROM vehicles WHERE owner_id = $1 ORDER BY created_at DESC', [ownerId]);
        return result.rows;
    },

    addVehicle: async (ownerId, vehicleData) => {
        const { make, model, plate, type, capacity, images, location, operating_range, price } = vehicleData;
        const result = await pool.query(
            'INSERT INTO vehicles (owner_id, make, model, plate, type, capacity, images, location, operating_range, price) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
            [ownerId, make, model, plate, type, capacity, images || [], location, operating_range, price]
        );
        return result.rows[0];
    },

    deleteVehicle: async (ownerId, vehicleId) => {
        const result = await pool.query('DELETE FROM vehicles WHERE id = $1 AND owner_id = $2 RETURNING *', [vehicleId, ownerId]);
        if (result.rows.length === 0) throw new Error('Vehicle not found or unauthorized');
        return { success: true };
    },

    getStats: async (ownerId) => {
        // 1. Fleet count & Total Capacity
        const fleetRes = await pool.query(`
            SELECT COUNT(*) as count,
            COALESCE(SUM(CAST(NULLIF(REGEXP_REPLACE(capacity, '[^0-9.]', '', 'g'), '') AS FLOAT)), 0) as capacity
            FROM vehicles WHERE owner_id = $1
        `, [ownerId]);

        // 2. Pending Bids for their trucks
        const bidsRes = await pool.query(`
            SELECT COUNT(b.id) as count 
            FROM bids b
            JOIN shipments s ON b.load_id = s.id
            WHERE s.owner_id = $1 AND b.status = 'Pending'
        `, [ownerId]);

        // 3. Active shipments
        const activeRes = await pool.query(`
            SELECT COUNT(*) as count FROM shipments 
            WHERE owner_id = $1 AND status NOT IN ('Completed', 'Delivered', 'Rejected', 'Cancelled')
        `, [ownerId]);

        // 4. Wallet
        const walletRes = await pool.query('SELECT balance, currency FROM wallets WHERE user_id = $1', [ownerId]);

        // 5. Total History (All time)
        const historyRes = await pool.query('SELECT COUNT(*) as count FROM shipments WHERE owner_id = $1', [ownerId]);

        return {
            fleetSize: parseInt(fleetRes.rows[0].count),
            totalCapacity: parseFloat(fleetRes.rows[0].capacity),
            activeJobs: parseInt(activeRes.rows[0].count),
            pendingBids: parseInt(bidsRes.rows[0].count),
            wallet: walletRes.rows[0] || { balance: 0, currency: 'MWK' },
            totalHistory: parseInt(historyRes.rows[0].count)
        };
    },

    getDrivers: async (ownerId) => {
        // Find drivers who have been assigned to shipments by this owner
        // In a more robust system, there would be a many-to-many or a direct link in users table
        const result = await pool.query(`
            SELECT DISTINCT u.id, u.name, u.phone, u.created_at
            FROM users u
            JOIN shipments s ON u.id = s.assigned_driver_id
            WHERE s.owner_id = $1
        `, [ownerId]);

        return result.rows.map(d => ({
            ...d,
            status: 'Available', // Mocking status for now
            trips: 0 // Could be calculated
        }));
    },

    getListings: async (ownerId) => {
        const result = await pool.query('SELECT * FROM vehicle_listings WHERE driver_id = $1 ORDER BY created_at DESC', [ownerId]);
        return result.rows;
    },

    deleteListing: async (ownerId, listingId) => {
        const result = await pool.query('DELETE FROM vehicle_listings WHERE id = $1 AND driver_id = $2 RETURNING *', [listingId, ownerId]);
        if (result.rows.length === 0) throw new Error('Listing not found or unauthorized');

        // Also remove from central marketplace
        const marketplaceService = require('./marketplaceService');
        await marketplaceService.removeItem(listingId);

        return { success: true };
    },

    getRevenueAnalytics: async (ownerId) => {
        const result = await pool.query(`
            SELECT TO_CHAR(created_at, 'Mon') as month, SUM(net_amount) as amount 
            FROM transactions 
            WHERE user_id = $1 AND type != 'Withdrawal' 
              AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
            GROUP BY month, EXTRACT(MONTH FROM created_at)
            ORDER BY EXTRACT(MONTH FROM created_at)
        `, [ownerId]);
        return result.rows;
    },

    getMyTrips: async (ownerId) => {
        const result = await pool.query(`
            SELECT s.*, u.name as driver_name, u.phone as driver_phone
            FROM shipments s
            LEFT JOIN users u ON s.assigned_driver_id = u.id
            WHERE s.owner_id = $1
            ORDER BY s.created_at DESC
        `, [ownerId]);
        return result.rows;
    }
};

module.exports = logisticsService;
