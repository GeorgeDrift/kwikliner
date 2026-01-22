const shipperService = require('../services/shipperService');

const shipperController = {
    getLoads: async (req, res) => {
        try {
            const loads = await shipperService.getLoads(req.user.id);
            res.json(loads);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch loads' });
        }
    },

    postLoad: async (req, res) => {
        try {
            const load = await shipperService.postLoad(req.user.id, req.body);
            res.json(load);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to post load' });
        }
    },

    acceptBid: async (req, res) => {
        const { loadId, bidId } = req.body;
        try {
            const result = await shipperService.acceptBid(loadId, bidId);
            res.json(result);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message || 'Failed to accept bid' });
        }
    },

    payDeposit: async (req, res) => {
        try {
            const shipment = await shipperService.payDeposit(req.params.loadId);
            res.json(shipment);
        } catch (err) {
            res.status(500).json({ error: err.message || 'Deposit payment failed' });
        }
    },

    submitRating: async (req, res) => {
        const { loadId, rating, comment } = req.body;
        try {
            const shipment = await shipperService.submitRating(loadId, rating, comment);
            res.json(shipment);
        } catch (err) {
            res.status(500).json({ error: err.message || 'Failed to submit rating' });
        }
    },

    getStats: async (req, res) => {
        try {
            const stats = await shipperService.getStats(req.user.id);
            res.json(stats);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch stats' });
        }
    },

    getVehicleListings: async (req, res) => {
        try {
            const listings = await shipperService.getVehicleListings();
            res.json(listings);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch vehicle listings' });
        }
    },

    getLogisticsServices: async (req, res) => {
        try {
            const services = await shipperService.getLogisticsServices();
            res.json(services);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch logistics services' });
        }
    },

    getBids: async (req, res) => {
        try {
            const bids = await shipperService.getBids(req.user.id);
            res.json(bids);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch bids' });
        }
    },

    bookService: async (req, res) => {
        try {
            const { serviceId } = req.body;
            const result = await shipperService.bookService(req.user.id, serviceId);
            res.json(result);
        } catch (err) {
            res.status(500).json({ error: 'Failed to book service' });
        }
    }
};

module.exports = shipperController;
