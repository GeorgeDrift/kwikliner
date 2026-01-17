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
    }
};

module.exports = shipperController;
