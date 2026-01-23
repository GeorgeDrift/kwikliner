require('dotenv').config();
const pool = require('./db');
const authService = require('./services/authService');

async function resend() {
    try {
        const email = 'natn26956@gmail.com';
        console.log(`Attempting to resend verification to: ${email}`);
        const result = await authService.resendVerification(email);

        // Fetch the token to show it here
        const userRes = await pool.query('SELECT verification_token FROM users WHERE email = $1', [email]);
        const token = userRes.rows[0].verification_token;
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

        console.log('\n--- SUCCESS ---');
        console.log(result.message);
        console.log(`New Manual Link: ${frontendUrl}/#/verify-email?token=${token}`);
        console.log('---------------');
    } catch (err) {
        console.error('FAILED:', err.message);
    } finally {
        process.exit();
    }
}

resend();
