const hardwareMiddleware = (req, res, next) => {
    if (req.user.role !== 'HARDWARE_OWNER') {
        return res.status(403).json({ message: 'Access denied: Hardware Owner role required' });
    }
    next();
};

module.exports = hardwareMiddleware;
