const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'kwikliner_secret_key_2024';

const authService = {
    register: async (userData) => {
        const { role, name, email, phone, password, companyName } = userData;
        const passwordHash = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users (role, name, email, phone, password_hash, company_name, compliance_status) 
             VALUES ($1, $2, $3, $4, $5, $6, 'APPROVED') RETURNING id, role, name, email`,
            [role, name, email, phone, passwordHash, companyName]
        );

        const user = result.rows[0];
        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

        return { user, token };
    },

    login: async (credentials) => {
        const { email, password, role } = credentials;

        // For demo convenience, if email is missing we search by role
        const query = email ? 'SELECT * FROM users WHERE email = $1' : 'SELECT * FROM users WHERE role = $1 LIMIT 1';
        const params = email ? [email] : [role];

        const result = await pool.query(query, params);
        const user = result.rows[0];

        if (!user) throw new Error('User not found');

        if (email && password) {
            const isMatch = await bcrypt.compare(password, user.password_hash);
            if (!isMatch) throw new Error('Invalid credentials');
        }

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

        return {
            token,
            user: {
                id: user.id,
                role: user.role,
                name: user.name,
                email: user.email,
                phone: user.phone,
                companyName: user.company_name,
                isVerified: user.is_verified,
                complianceStatus: user.compliance_status
            }
        };
    },

    getProfile: async (userId) => {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        const user = result.rows[0];
        if (user) delete user.password_hash;
        return user;
    }
};

module.exports = authService;
