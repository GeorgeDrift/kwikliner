const pool = require('./db');
const marketplaceService = require('./services/marketplaceService');

async function seed() {
    try {
        console.log("Starting comprehensive seed...");

        // 1. Get existing users
        const drivers = await pool.query("SELECT id, name FROM users WHERE role = 'DRIVER' LIMIT 2");
        const shippers = await pool.query("SELECT id, name FROM users WHERE role = 'SHIPPER' LIMIT 1");

        if (drivers.rowCount === 0 || shippers.rowCount === 0) {
            console.error("Need at least one driver and one shipper to seed.");
            process.exit(1);
        }

        const driver1Id = drivers.rows[0].id;
        const driver1Name = drivers.rows[0].name;
        const driver2Id = (drivers.rows[1] || drivers.rows[0]).id;
        const driver2Name = (drivers.rows[1] || drivers.rows[0]).name;
        const shipperId = shippers.rows[0].id;

        console.log(`Using Driver 1: ${driver1Name} (${driver1Id})`);
        console.log(`Using Shipper: ${shippers.rows[0].name} (${shipperId})`);

        // 2. Create Vehicle Listings
        console.log("Creating vehicle listings...");
        const listing1 = await pool.query(`
            INSERT INTO vehicle_listings 
            (driver_id, driver_name, vehicle_type, capacity, route, price, location, rating)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `, [driver1Id, driver1Name, 'Box Truck', '5 Tons', 'Lilongwe - Blantyre', '75000', 'Lilongwe', 4.8]);

        const listing2 = await pool.query(`
            INSERT INTO vehicle_listings 
            (driver_id, driver_name, vehicle_type, capacity, route, price, location, rating)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `, [driver2Id, driver2Name, 'Flatbed Trailer', '20 Tons', 'All Routes', '150000', 'Blantyre', 4.9]);

        // 3. Sync to Marketplace
        console.log("Syncing to marketplace...");
        await marketplaceService.syncVehicle(listing1.rows[0]);
        await marketplaceService.syncVehicle(listing2.rows[0]);

        // 4. Create a shipment and a bid for EACH shipper
        console.log("Creating sample shipments and bids for all shippers...");
        const allShippers = await pool.query("SELECT id, name FROM users WHERE role = 'SHIPPER'");

        for (const s of allShippers.rows) {
            const shipmentId = `#KW-${Math.floor(100000 + Math.random() * 900000)}`;
            console.log(`Seeding for Shipper: ${s.name} (${s.id}) -> Load ${shipmentId}`);

            await pool.query(`
                INSERT INTO shipments (id, shipper_id, route, cargo, price, status)
                VALUES ($1, $2, $3, $4, $5, $6)
                ON CONFLICT DO NOTHING
            `, [shipmentId, s.id, 'Lilongwe to Mzuzu', 'Maize Bags', 120000, 'Bidding Open']);

            await pool.query(`
                INSERT INTO bids (load_id, driver_id, amount, status)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT DO NOTHING
            `, [shipmentId, driver1Id, 115000, 'Pending']);
        }

        console.log("Seeding successful!");
        process.exit(0);
    } catch (err) {
        console.error("Seeding failed:", err);
        process.exit(1);
    }
}

seed();
