const pool = require('./db');

async function findGeorge() {
    try {
        const res = await pool.query("SELECT id, name, role FROM users WHERE name ILIKE '%george%'");
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

findGeorge();
