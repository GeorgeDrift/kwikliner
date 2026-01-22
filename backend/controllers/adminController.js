const pool = require('../db');

// Get Dashboard Statistics
const getDashboardStats = async (req, res) => {
    try {
        // 1. Total Users Breakdown
        const usersQuery = await pool.query(`
            SELECT role, COUNT(*) as count 
            FROM users 
            GROUP BY role
        `);
        const totalUsers = usersQuery.rows.reduce((acc, curr) => acc + parseInt(curr.count), 0);

        // 2. Revenue (Mock calculation from shipments for now as we don't have a transaction table)
        // Assuming 10% commission on all 'In Transit' or 'Delivered' shipments
        const revenueQuery = await pool.query(`
            SELECT SUM(price) as total_volume 
            FROM shipments 
            WHERE status IN ('In Transit', 'Delivered', 'Completed')
        `);
        const totalVolume = revenueQuery.rows[0].total_volume || 0;
        const totalRevenue = totalVolume * 0.10; // 10% commission

        // 3. active system load (Mocked for now)
        const systemLoad = 98;

        // 4. Pending Alerts (Users pending compliance)
        const alertsQuery = await pool.query(`
            SELECT COUNT(*) as count 
            FROM users 
            WHERE compliance_status = 'PENDING'
        `);
        const pendingAlerts = alertsQuery.rows[0].count;

        // 5. Recent Signups
        const recentUsersQuery = await pool.query(`
            SELECT id, name, role, created_at, compliance_status 
            FROM users 
            ORDER BY created_at DESC 
            LIMIT 5
        `);

        // 6. Recent Shipments (as proxy for transactions)
        const recentShipmentsQuery = await pool.query(`
            SELECT s.id, s.created_at, u.name as initiator, s.price, s.status 
            FROM shipments s
            JOIN users u ON s.shipper_id = u.id
            ORDER BY s.created_at DESC 
            LIMIT 5
        `);

        res.json({
            overview: {
                totalUsers,
                totalRevenue,
                systemLoad,
                pendingAlerts
            },
            recentUsers: recentUsersQuery.rows,
            recentTransactions: recentShipmentsQuery.rows.map(s => ({
                id: s.id,
                date: new Date(s.created_at).toLocaleDateString(),
                from: s.initiator, // The shipper
                type: 'SHIPMENT',
                amount: s.price,
                status: s.status
            }))
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get All Users with Searching
const getUsers = async (req, res) => {
    try {
        const { search } = req.query;
        let query = `
            SELECT id, name, role, email, phone, compliance_status as status, 
            (SELECT COALESCE(SUM(price), 0) FROM shipments WHERE driver_id = users.id OR shipper_id = users.id) as earnings 
            FROM users
        `;

        const params = [];
        if (search) {
            query += ` WHERE name ILIKE $1 OR email ILIKE $1 OR role ILIKE $1`;
            params.push(`%${search}%`);
        }

        query += ` ORDER BY created_at DESC`;

        const users = await pool.query(query, params);
        res.json(users.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Toggle User Status
const toggleUserStatus = async (req, res) => {
    try {
        const { id } = req.params;

        // Check current status
        const user = await pool.query('SELECT compliance_status FROM users WHERE id = $1', [id]);
        if (user.rows.length === 0) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const currentStatus = user.rows[0].compliance_status;
        const newStatus = currentStatus === 'APPROVED' ? 'SUSPENDED' : 'APPROVED';

        await pool.query('UPDATE users SET compliance_status = $1 WHERE id = $2', [newStatus, id]);

        res.json({ msg: `User status updated to ${newStatus}`, status: newStatus });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getDashboardStats,
    getUsers,
    toggleUserStatus
};
