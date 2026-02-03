const pool = require('./db');
const marketplaceService = require('./services/marketplaceService');

async function migrate() {
    try {
        console.log("=== START MARKETPLACE MIGRATION ===");

        // 1. Fetch and Sync Shipments
        const shipmentsRes = await pool.query('SELECT * FROM shipments');
        console.log(`Found ${shipmentsRes.rows.length} total shipments.`);
        for (const shipment of shipmentsRes.rows) {
            await marketplaceService.syncShipment(shipment);
        }

        // 2. Fetch and Sync Products
        const productsRes = await pool.query(`
            SELECT p.*, u.name as seller 
            FROM products p 
            JOIN users u ON p.owner_id = u.id
        `);
        console.log(`Found ${productsRes.rows.length} total products.`);
        for (const product of productsRes.rows) {
            await marketplaceService.syncProduct(product);
        }

        // 3. Fetch and Sync Vehicles
        const vehiclesRes = await pool.query('SELECT * FROM vehicle_listings');
        console.log(`Found ${vehiclesRes.rows.length} total vehicle listings.`);
        for (const vehicle of vehiclesRes.rows) {
            await marketplaceService.syncVehicle(vehicle);
        }

        // 4. Verification
        const stats = await pool.query('SELECT type, COUNT(*) FROM marketplace_items GROUP BY type');
        console.log('Migration Complete. Stats:', stats.rows);

        console.log("=== END MARKETPLACE MIGRATION ===");
    } catch (err) {
        console.error("MIGRATION ERROR:", err);
    } finally {
        process.exit();
    }
}

migrate();
