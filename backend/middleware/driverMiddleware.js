const driverMiddleware = (req, res, next) => {
    if (req.user.role !== 'DRIVER' && req.user.role !== 'LOGISTICS_OWNER') {
        return res.status(403).json({ message: 'Access denied: Driver or Logistics Owner role required' });
    }
    next();
};

module.exports = driverMiddleware;
