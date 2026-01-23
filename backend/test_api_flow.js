const axios = require('axios');
const pool = require('./db');

const API_URL = 'http://localhost:5000/api';

async function testApi() {
    try {
        const email = `test_driver_${Date.now()}@test.com`;
        const password = 'password123';

        console.log(`1. Registering new driver: ${email}...`);
        try {
            await axios.post(`${API_URL}/auth/register`, {
                name: 'Test Driver',
                email: email,
                password: password,
                phone: `26599${Math.floor(1000000 + Math.random() * 9000000)}`,
                role: 'DRIVER',
                city: 'Lilongwe',
                location: 'Test Location',
                agreeCompliance: true
            });
            console.log('   Registration Sent.');

            // Manually verify in DB
            console.log('2. Manually Verifying User in DB...');
            await pool.query("UPDATE users SET is_verified = true WHERE email = $1", [email]);
            console.log('   User verified.');

            console.log('3. Attempting Login...');
            const loginRes = await axios.post(`${API_URL}/auth/login`, {
                email: email,
                password: password
            });

            const token = loginRes.data.token;
            console.log('   Login Successful. Token obtained.');

            // Check Profile to confirm role
            // const profile = await axios.get(`${API_URL}/auth/profile`, { headers: { Authorization: `Bearer ${token}` } });
            // console.log(`   Logged in as: ${profile.data.role}`);

            console.log('4. Fetching Driver Jobs...');
            const jobsRes = await axios.get(`${API_URL}/driver/jobs`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log(`   Response Status: ${jobsRes.status}`);
            console.log(`   Jobs Found: ${jobsRes.data.length}`);
            console.log(JSON.stringify(jobsRes.data, null, 2));

        } catch (e) {
            console.error('   API Error:', e.message);
            if (e.response) {
                console.error('   Status:', e.response.status);
                console.error('   Data:', e.response.data);
            }
        }

        pool.end();

    } catch (err) {
        console.error(err);
    }
}

testApi();
