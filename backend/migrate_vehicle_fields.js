const pool = require('./db');

async function migrate() {
    try {
        console.log("🚀 Starting database migration for vehicle_listings...");

        // Add manufacturer column
        await pool.query(`
            ALTER TABLE vehicle_listings 
            ADD COLUMN IF NOT EXISTS manufacturer VARCHAR(255)
        `);
        console.log("✅ Added manufacturer column");

        // Add model column
        await pool.query(`
            ALTER TABLE vehicle_listings 
            ADD COLUMN IF NOT EXISTS model VARCHAR(255)
        `);
        console.log("✅ Added model column");

        // Add operating_range column
        await pool.query(`
            ALTER TABLE vehicle_listings 
            ADD COLUMN IF NOT EXISTS operating_range VARCHAR(512)
        `);
        console.log("✅ Added operating_range column");

        // Ensure location column exists (it seemed to exist but good to be sure)
        await pool.query(`
            ALTER TABLE vehicle_listings 
            ADD COLUMN IF NOT EXISTS location VARCHAR(255)
        `);
        console.log("✅ Ensured location column exists");

        console.log("🎊 Migration completed successfully!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Migration failed:", err.message);
        process.exit(1);
    }
}

migrate();
