const pool = require('./db');
const axios = require('axios');
const API_URL = 'http://localhost:5000/api';

async function setupUser() {
    try {
        const email = 'browser_test@kwikliner.com';
        const password = 'password123';

        console.log(`Checking if ${email} exists...`);
        const check = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (check.rows.length === 0) {
            console.log('User not found. Registering...');
            try {
                await axios.post(`${API_URL}/auth/register`, {
                    name: 'Browser Test Driver',
                    email: email,
                    password: password,
                    phone: '265999000000',
                    role: 'DRIVER',
                    city: 'Lilongwe',
                    location: 'Test HQ',
                    agreeCompliance: true
                });
            } catch (e) {
                console.log('Register API failed (might be ok if verify pending):', e.message);
            }
        } else {
            console.log('User exists.');
        }

        console.log('Ensuring user is verified...');
        await pool.query('UPDATE users SET is_verified = true WHERE email = $1', [email]);
        console.log('User verified successfully.');
        pool.end();
    } catch (err) {
        console.error('Setup failed:', err);
    }
}

setupUser();
