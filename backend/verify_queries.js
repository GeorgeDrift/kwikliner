const pool = require('./db');

async function verify() {
    try {
        const shippers = await pool.query("SELECT id FROM users WHERE role = 'SHIPPER' LIMIT 1");
        if (shippers.rowCount === 0) {
            console.log("No shipper found.");
            process.exit(0);
        }
        const shipperId = shippers.rows[0].id;
        console.log(`Testing for Shipper ID: ${shipperId}`);

        const query = `
            SELECT 
                b.*, 
                s.route, 
                s.cargo, 
                u.name as driver_name,
                COALESCE(vl.rating, 5.0) as driver_rating,
                COALESCE(vl.vehicle_type, 'Truck') as vehicle_type
            FROM bids b
            JOIN shipments s ON b.load_id = s.id
            JOIN users u ON b.driver_id = u.id
            LEFT JOIN (
                SELECT DISTINCT ON (driver_id) driver_id, rating, vehicle_type 
                FROM vehicle_listings 
                ORDER BY driver_id, created_at DESC
            ) vl ON b.driver_id = vl.driver_id
            WHERE s.shipper_id = $1 AND b.status = 'Pending'
            ORDER BY b.created_at DESC
        `;

        const result = await pool.query(query, [shipperId]);
        console.log(`Found ${result.rowCount} bids for this shipper.`);
        console.log(result.rows);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

verify();
