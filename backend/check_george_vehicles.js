const pool = require('./db');

async function checkVehicles() {
    try {
        const res = await pool.query("SELECT * FROM vehicles WHERE owner_id = 'be37fa1a-0b25-436f-9255-c776c788256a'");
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

checkVehicles();
