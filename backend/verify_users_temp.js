
const pool = require('./db');

const verifyUsers = async () => {
    try {
        const client = await pool.connect();
        try {
            console.log('Verifying users...');
            const emails = ['logistics_owner_demo@test.com', 'hardware_owner_demo@test.com'];

            const res = await client.query(`
        UPDATE users 
        SET "isVerified" = true, "complianceStatus" = 'APPROVED'
        WHERE email = ANY($1) 
        RETURNING *;
      `, [emails]);

            console.log(`Updated ${res.rowCount} users:`);
            res.rows.forEach(u => console.log(`- ${u.email} (Verified: ${u.isVerified})`));

        } finally {
            client.release();
        }
    } catch (err) {
        console.error('Error verification users:', err);
    } finally {
        await pool.end();
    }
};

verifyUsers();
