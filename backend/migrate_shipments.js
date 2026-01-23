const pool = require('./db');

async function migrate() {
    try {
        console.log('Starting migration: Adding images and quantity to shipments table...');

        await pool.query(`
            ALTER TABLE shipments 
            ADD COLUMN IF NOT EXISTS images TEXT[],
            ADD COLUMN IF NOT EXISTS quantity VARCHAR(255);
        `);

        console.log('Migration successful: columns added.');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
