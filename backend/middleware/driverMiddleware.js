const driverMiddleware = (req, res, next) => {
    if (req.user.role !== 'DRIVER' && req.user.role !== 'LOGISTICS_OWNER' && req.user.role !== 'HARDWARE_OWNER') {
        return res.status(403).json({ message: 'Access denied: Driver, Logistics, or Hardware Owner role required' });
    }
    next();
};

module.exports = driverMiddleware;
