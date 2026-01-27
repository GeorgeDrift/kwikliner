const driverService = require('../services/driverService');

const driverController = {
    getJobs: async (req, res) => {
        try {
            const jobs = await driverService.getJobs(req.user.id);
            res.json(jobs);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch jobs' });
        }
    },

    postVehicleListing: async (req, res) => {
        try {
            const listing = await driverService.postVehicleListing(req.user.id, req.body);
            res.json(listing);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to post availability' });
        }
    },


    bidOnLoad: async (req, res) => {
        try {
            const bid = await driverService.bidOnLoad(req.user.id, req.body);
            res.json(bid);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Bidding failed' });
        }
    },

    commitToJob: async (req, res) => {
        const { loadId, decision } = req.body;
        try {
            const result = await driverService.commitToJob(loadId, decision);
            res.json(result);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Commitment failed' });
        }
    },

    updateShipmentStatus: async (req, res) => {
        const { loadId, status } = req.body;
        try {
            const result = await driverService.updateShipmentStatus(loadId, status);
            res.json(result);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Status update failed' });
        }
    },

    getTrips: async (req, res) => {
        try {
            const trips = await driverService.getMyTrips(req.user.id);
            res.json(trips);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch trips' });
        }
    },

    getStats: async (req, res) => {
        try {
            console.log(`[DriverController] Stats requested by user: ${req.user.id}`);
            const stats = await driverService.getStats(req.user.id);
            res.json(stats);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
        }
    },

    getListings: async (req, res) => {
        try {
            const listings = await driverService.getMyListings(req.user.id);
            res.json(listings);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch your listings' });
        }
    },
    getFleet: async (req, res) => {
        try {
            const fleet = await driverService.getFleet(req.user.id);
            res.json(fleet);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch fleet' });
        }
    },
    triggerDeposit: async (req, res) => {
        try {
            const result = await driverService.triggerDepositReminder(req.params.loadId);
            res.json(result);
        } catch (err) {
            res.status(500).json({ error: err.message || 'Failed to trigger deposit reminder' });
        }
    }
};

module.exports = driverController;
