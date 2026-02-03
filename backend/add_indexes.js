const pool = require('./db');

const addIndexes = async () => {
    try {
        console.log('Starting index creation...');

        // 1. Shipments Table Indexes
        console.log('Adding indexes to table: shipments');
        await pool.query('CREATE INDEX IF NOT EXISTS idx_shipments_owner_id ON shipments(owner_id)');
        await pool.query('CREATE INDEX IF NOT EXISTS idx_shipments_driver_id ON shipments(assigned_driver_id)');
        await pool.query('CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(status)');
        await pool.query('CREATE INDEX IF NOT EXISTS idx_shipments_created_at ON shipments(created_at DESC)');

        // 2. Bids Table Indexes
        console.log('Adding indexes to table: bids');
        await pool.query('CREATE INDEX IF NOT EXISTS idx_bids_load_id ON bids(load_id)');
        await pool.query('CREATE INDEX IF NOT EXISTS idx_bids_status ON bids(status)');

        // 3. My Fleet Table Indexes
        console.log('Adding indexes to table: my_fleet');
        await pool.query('CREATE INDEX IF NOT EXISTS idx_fleet_owner_id ON my_fleet(owner_id)');
        await pool.query('CREATE INDEX IF NOT EXISTS idx_fleet_created_at ON my_fleet(created_at DESC)');

        // 4. Vehicle Listings Table Indexes
        console.log('Adding indexes to table: vehicle_listings');
        await pool.query('CREATE INDEX IF NOT EXISTS idx_listings_driver_id ON vehicle_listings(driver_id)');
        await pool.query('CREATE INDEX IF NOT EXISTS idx_listings_created_at ON vehicle_listings(created_at DESC)');

        console.log('✅ Successfully added all database indexes!');
    } catch (err) {
        console.error('❌ Error adding indexes:', err);
    } finally {
        await pool.end();
    }
};

addIndexes();
