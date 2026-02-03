const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:2001@localhost:5432/kwikliner'
});

async function checkFleet() {
    try {
        const res = await pool.query('SELECT * FROM my_fleet');
        console.log('Fleet entries:', res.rows.length);
        console.log('First entry:', JSON.stringify(res.rows[0], null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkFleet();
