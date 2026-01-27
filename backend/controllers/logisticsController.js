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
    },

    getStats: async (req, res) => {
        try {
            const stats = await logisticsService.getStats(req.user.id);
            res.json(stats);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch logistics stats' });
        }
    },

    getDrivers: async (req, res) => {
        try {
            const drivers = await logisticsService.getDrivers(req.user.id);
            res.json(drivers);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch drivers' });
        }
    },

    getListings: async (req, res) => {
        try {
            const listings = await logisticsService.getListings(req.user.id);
            res.json(listings);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch listings' });
        }
    },

    deleteListing: async (req, res) => {
        try {
            await logisticsService.deleteListing(req.user.id, req.params.id);
            res.json({ success: true });
        } catch (err) {
            res.status(500).json({ error: err.message || 'Failed to delete listing' });
        }
    },

    getRevenueAnalytics: async (req, res) => {
        try {
            const analytics = await logisticsService.getRevenueAnalytics(req.user.id);
            res.json(analytics);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch revenue analytics' });
        }
    },

    getTrips: async (req, res) => {
        try {
            const trips = await logisticsService.getMyTrips(req.user.id);
            res.json(trips);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch trips' });
        }
    }
};

module.exports = logisticsController;
