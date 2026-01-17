const logisticsService = require('../services/logisticsService');

const logisticsController = {
    getFleet: async (req, res) => {
        try {
            const fleet = await logisticsService.getFleet(req.user.id);
            res.json(fleet);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch fleet' });
        }
    },

    addVehicle: async (req, res) => {
        try {
            const vehicle = await logisticsService.addVehicle(req.user.id, req.body);
            res.json(vehicle);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to add vehicle' });
        }
    },

    deleteVehicle: async (req, res) => {
        try {
            await logisticsService.deleteVehicle(req.user.id, req.params.vehicleId);
            res.json({ success: true });
        } catch (err) {
            res.status(500).json({ error: err.message || 'Failed to delete vehicle' });
        }
    }
};

module.exports = logisticsController;
