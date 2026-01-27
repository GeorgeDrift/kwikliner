const pool = require('./db');
const driverService = require('./services/driverService');

async function testStats() {
    const driverId = 'be37fa1a-0b25-436f-9255-c776c788256a';
    try {
        const stats = await driverService.getStats(driverId);
        console.log("Stats Output:");
        console.log(JSON.stringify(stats, null, 2));

        // Let's also check the raw query for fleet capacity
        const fleetRes = await pool.query(`
            SELECT COUNT(*) as count, 
            COALESCE(SUM(CAST(REGEXP_REPLACE(NULLIF(capacity, ''), '[^0-9.]', '', 'g') AS FLOAT)), 0) as capacity 
            FROM vehicles WHERE owner_id = $1
        `, [driverId]);
        console.log("\nRaw Fleet Query Result:");
        console.log(JSON.stringify(fleetRes.rows[0], null, 2));

    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

testStats();
