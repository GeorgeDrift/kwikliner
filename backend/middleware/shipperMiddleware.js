const shipperMiddleware = (req, res, next) => {
    if (req.user.role !== 'SHIPPER') {
        return res.status(403).json({ message: 'Access denied: Shipper role required' });
    }
    next();
};

module.exports = shipperMiddleware;
