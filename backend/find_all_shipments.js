const pool = require('./db');

async function debug() {
    try {
        console.log("=== START SHIPMENT AUDIT ===");
        const countRes = await pool.query('SELECT COUNT(*) FROM shipments');
        console.log("Total Shipments Count:", countRes.rows[0].count);

        const allRes = await pool.query('SELECT * FROM shipments');
        console.log("All Shipments Rows:");
        console.table(allRes.rows.map(r => ({
            id: r.id,
            shipper: r.shipper_id,
            status: r.status,
            cargo: r.cargo,
            created: r.created_at
        })));

        const shippersRes = await pool.query('SELECT DISTINCT shipper_id FROM shipments');
        console.log("Unique Shippers in Table:", shippersRes.rows);

        console.log("=== END SHIPMENT AUDIT ===");
    } catch (err) {
        console.error("DEBUG ERROR:", err);
    } finally {
        process.exit();
    }
}

debug();
