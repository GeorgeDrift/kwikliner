const pool = require('../db');

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
        return result.rows[0];
    },

    commitToJob: async (loadId, decision) => {
        const status = decision === 'COMMIT' ? 'Pending Deposit' : 'Finding Driver';
        const color = decision === 'COMMIT' ? 'text-amber-600 bg-amber-50' : 'text-blue-600 bg-blue-50';

        const result = await pool.query(
            'UPDATE shipments SET status = $1, color = $2 WHERE id = $3 RETURNING *',
            [status, color, loadId]
        );

        if (result.rows.length === 0) throw new Error('Shipment not found');
        return result.rows[0];
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
        return result.rows[0];
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
        return result.rows[0];
    }
};

module.exports = driverService;

