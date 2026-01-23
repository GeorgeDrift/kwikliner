require('dotenv').config({ path: './backend/.env' });
const pool = require('./backend/db');
const authService = require('./backend/services/authService');

async function resend() {
    try {
        const email = 'natn26956@gmail.com';
        console.log(`Attempting to resend verification to: ${email}`);
        const result = await authService.resendVerification(email);

        // Let's also fetch the token to show it here in case SMTP fails or they can't wait
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
