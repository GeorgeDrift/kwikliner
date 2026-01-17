const pool = require('../db');

const shipperService = {
    getLoads: async (shipperId) => {
        const result = await pool.query('SELECT * FROM shipments WHERE shipper_id = $1 ORDER BY created_at DESC', [shipperId]);
        return result.rows;
    },

    postLoad: async (shipperId, loadData) => {
        const { route, cargo, weight, price, pickupType, orderRef } = loadData;
        const id = `#KW-${Math.floor(100000 + Math.random() * 900000)}`;

        const result = await pool.query(
            `INSERT INTO shipments (id, shipper_id, route, cargo, weight, price, pickup_type, order_ref, status, color) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Finding Driver', 'text-blue-600 bg-blue-50') RETURNING *`,
            [id, shipperId, route, cargo, weight, price, pickupType || 'Standard', orderRef]
        );

        return result.rows[0];
    },

    acceptBid: async (loadId, bidId) => {
        try {
            await pool.query('BEGIN');

            // Accept the bid
            const bidResult = await pool.query('UPDATE bids SET status = $1 WHERE id = $2 RETURNING driver_id', ['Accepted', bidId]);
            if (bidResult.rows.length === 0) throw new Error('Bid not found');
            const driverId = bidResult.rows[0].driver_id;

            // Update shipment
            await pool.query(
                "UPDATE shipments SET status = $1, driver_id = $2, color = $3 WHERE id = $4",
                ['Waiting for Driver Commitment', driverId, 'text-purple-600 bg-purple-50', loadId]
            );

            // Reject other bids
            await pool.query('UPDATE bids SET status = $1 WHERE load_id = $2 AND id != $3', ['Rejected', loadId, bidId]);

            await pool.query('COMMIT');
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
        return result.rows[0];
    }
};

module.exports = shipperService;
