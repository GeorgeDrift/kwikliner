const logisticsMiddleware = (req, res, next) => {
    if (req.user.role !== 'LOGISTICS_OWNER') {
        return res.status(403).json({ message: 'Access denied: Logistics Owner role required' });
    }
    next();
};

module.exports = logisticsMiddleware;
