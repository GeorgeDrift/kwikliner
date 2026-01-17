const pool = require('../db');

const logisticsService = {
    getFleet: async (ownerId) => {
        const result = await pool.query('SELECT * FROM vehicles WHERE owner_id = $1 ORDER BY created_at DESC', [ownerId]);
        return result.rows;
    },

    addVehicle: async (ownerId, vehicleData) => {
        const { make, model, plate, type, capacity, image } = vehicleData;
        const result = await pool.query(
            'INSERT INTO vehicles (owner_id, make, model, plate, type, capacity, image) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [ownerId, make, model, plate, type, capacity, image]
        );
        return result.rows[0];
    },

    deleteVehicle: async (ownerId, vehicleId) => {
        const result = await pool.query('DELETE FROM vehicles WHERE id = $1 AND owner_id = $2 RETURNING *', [vehicleId, ownerId]);
        if (result.rows.length === 0) throw new Error('Vehicle not found or unauthorized');
        return { success: true };
    }
};

module.exports = logisticsService;
