const pool = require('./db');

async function checkShipmentDistribution() {
    try {
        const res = await pool.query(`
            SELECT 
                u.name, 
                u.id, 
                (SELECT count(*) FROM shipments s WHERE s.driver_id = u.id OR s.assigned_driver_id = u.id) as driver_shipments,
                (SELECT count(*) FROM vehicles v WHERE v.owner_id = u.id) as vehicle_count
            FROM users u
            WHERE u.name ILIKE '%george%'
        `);
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

checkShipmentDistribution();
