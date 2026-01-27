const pool = require('./db');

async function syncListingsToVehicles() {
    try {
        console.log("🚀 Starting synchronization from vehicle_listings to vehicles...");

        // 1. Find all listings that don't have a corresponding entry in vehicles
        // Since we don't have a direct link yet, we'll use driver_account + manufacturer/model/capacity as a heuristic
        // Or just sync all unique ones if vehicles is empty.

        const listings = await pool.query('SELECT * FROM vehicle_listings');
        console.log(`Found ${listings.rows.length} listings to process.`);

        let syncedCount = 0;
        for (const listing of listings.rows) {
            // Check if already exists in vehicles (by owner and plate if we had it, but here we use make/model/capacity)
            const check = await pool.query(
                'SELECT id FROM vehicles WHERE owner_id = $1 AND make = $2 AND model = $3 AND capacity = $4',
                [listing.driver_id, listing.manufacturer || 'Unknown', listing.model || 'Vehicle', listing.capacity]
            );

            if (check.rows.length === 0) {
                await pool.query(
                    'INSERT INTO vehicles (owner_id, make, model, type, capacity, images) VALUES ($1, $2, $3, $4, $5, $6)',
                    [listing.driver_id, listing.manufacturer || 'Unknown', listing.model || 'Vehicle', listing.vehicle_type || 'Truck', listing.capacity, listing.images || []]
                );
                syncedCount++;
            }
        }

        console.log(`✅ Synchronization complete. Added ${syncedCount} vehicles to fleet.`);
        process.exit(0);
    } catch (err) {
        console.error("❌ Sync failed:", err.message);
        process.exit(1);
    }
}

syncListingsToVehicles();
