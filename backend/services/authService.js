const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'kwikliner_secret_key_2024';

const emailService = require('./emailService');

const authService = {
    register: async (userData) => {
        const { role, name, email, phone, password, companyName, city, location, poBox } = userData;
        const passwordHash = await bcrypt.hash(password, 10);
        const verificationToken = require('crypto').randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

        const result = await pool.query(
            `INSERT INTO users (role, name, email, phone, password, company_name, compliance_status, is_verified, verification_token, verification_expires_at, city, location, po_box) 
             VALUES ($1, $2, $3, $4, $5, $6, 'APPROVED', false, $7, $8, $9, $10, $11) RETURNING id, role, name, email`,
            [role, name, email, phone, passwordHash, companyName, verificationToken, expiresAt, city, location, poBox]
        );

        const user = result.rows[0];

        // Send Verification Email
        await emailService.sendVerificationEmail({ name, email, token: verificationToken });

        return { message: 'Registration successful. Please check your email to verify your account.', user };
    },

    verifyEmail: async (token) => {
        // First check if a user with this token exists
        const result = await pool.query(
            'SELECT id, verification_expires_at, is_verified FROM users WHERE verification_token = $1',
            [token]
        );

        if (result.rowCount === 0) {
            // Token not found. This could mean it was already used and cleared, 
            // or it's just invalid. To be idempotent, we'd need to know if the user
            // associated with this token is already verified.
            // But without the token, we can't find the user.
            throw new Error('Invalid verification token');
        }

        const user = result.rows[0];

        if (user.is_verified) {
            return { message: 'Email is already verified. You can log in.' };
        }

        if (new Date() > new Date(user.verification_expires_at)) {
            throw new Error('Verification link has expired. Please register again.');
        }

        await pool.query(
            'UPDATE users SET is_verified = true WHERE id = $1',
            [user.id]
        );

        // NOTE: We don't clear the token immediately to allow for idempotency
        // (e.g. if the user clicks twice or React StrictMode calls this twice).
        // It will be cleared later or just ignored since is_verified is now true.

        return { message: 'Email verified successfully. You can now log in.' };
    },

    resendVerification: async (email) => {
        const result = await pool.query(
            'SELECT name, is_verified FROM users WHERE email = $1',
            [email]
        );

        if (result.rowCount === 0) {
            throw new Error('User not found');
        }

        const user = result.rows[0];
        if (user.is_verified) {
            throw new Error('Your email is already verified. You can log in.');
        }

        const verificationToken = require('crypto').randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        await pool.query(
            'UPDATE users SET verification_token = $1, verification_expires_at = $2 WHERE email = $3',
            [verificationToken, expiresAt, email]
        );

        await emailService.sendVerificationEmail({ name: user.name, email, token: verificationToken });

        return { message: 'A new verification link has been sent to your email.' };
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
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) throw new Error('Invalid credentials');
        }

        if (!user.is_verified) {
            throw new Error('Your email is not verified. Please check your inbox for the verification link.');
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

        if (!user) return null;

        return {
            id: user.id,
            role: user.role,
            name: user.name,
            email: user.email,
            phone: user.phone,
            companyName: user.company_name,
            isVerified: user.is_verified,
            complianceStatus: user.compliance_status
        };
    }
};

module.exports = authService;
