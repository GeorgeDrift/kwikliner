const pool = require('./db');
const marketplaceService = require('./services/marketplaceService');

async function migrate() {
    try {
        console.log("=== START MARKETPLACE MIGRATION ===");

        // 1. Fetch all shipments
        const shipmentsRes = await pool.query('SELECT * FROM shipments');
        console.log(`Found ${shipmentsRes.rows.length} total shipments in DB.`);

        // 2. Sync each shipment
        for (const shipment of shipmentsRes.rows) {
            console.log(`Syncing Shipment: ${shipment.id} (Status: ${shipment.status})`);
            await marketplaceService.syncShipment(shipment);
        }

        // 3. Verify marketplace table
        const marketRes = await pool.query("SELECT COUNT(*) FROM marketplace_items WHERE type = 'Cargo'");
        console.log(`Migration Complete. Total Cargo in Marketplace: ${marketRes.rows[0].count}`);

        console.log("=== END MARKETPLACE MIGRATION ===");
    } catch (err) {
        console.error("MIGRATION ERROR:", err);
    } finally {
        process.exit();
    }
}

migrate();
