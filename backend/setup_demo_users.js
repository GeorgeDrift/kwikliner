
const axios = require('axios');
const pool = require('./db');

const API_URL = 'http://localhost:5000/api/auth/register';

const logisticsOwner = {
    role: 'LOGISTICS_OWNER',
    name: 'John Fleet',
    email: 'logistics_owner_demo@kwikliner.com',
    phone: '0999123456',
    password: 'password123',
    companyName: 'FastFleet Logistics',
    isVerified: false,
    complianceStatus: 'SUBMITTED'
};

const hardwareOwner = {
    role: 'HARDWARE_OWNER',
    name: 'Hardware Harry',
    email: 'hardware_owner_demo@kwikliner.com',
    phone: '0888123456',
    password: 'password123',
    companyName: 'Harrys Hardware',
    isVerified: true
};

async function registerUser(user) {
    try {
        console.log(`Registering ${user.role}: ${user.email}...`);
        const response = await axios.post(API_URL, user);
        console.log(`Success! User ID: ${response.data.user.id}`);
        return response.data.user;
    } catch (error) {
        if (error.response) {
            console.error(`Failed: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
            if (error.response.data.error && error.response.data.error.includes('duplicate key')) {
                console.log('User already exists, proceeding to verification step.');
                return { email: user.email }; // Return email for verification step
            }
        } else {
            console.error(`Error: ${error.message}`);
        }
        return null;
    }
}

async function verifyUsers() {
    console.log('\nVerifying users in database...');
    try {
        const client = await pool.connect();
        try {
            const emails = [logisticsOwner.email, hardwareOwner.email];
            const res = await client.query(`
                UPDATE users 
                SET is_verified = true, compliance_status = 'APPROVED'
                WHERE email = ANY($1) 
                RETURNING *;
            `, [emails]);

            console.log(`✅ Updated verification status for ${res.rowCount} users.`);
            res.rows.forEach(u => console.log(`   - ${u.email}: Verified=${u.is_verified}, Status=${u.compliance_status}`));
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('Database error:', err.message);
    } finally {
        await pool.end();
    }
}

async function main() {
    await registerUser(logisticsOwner);
    await registerUser(hardwareOwner);
    await verifyUsers();
}

main();
