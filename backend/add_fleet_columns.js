const pool = require('./db');

const up = async () => {
    try {
        console.log('Adding columns to vehicles table...');

        await pool.query(`
            ALTER TABLE vehicles 
            ADD COLUMN IF NOT EXISTS location TEXT,
            ADD COLUMN IF NOT EXISTS operating_range TEXT,
            ADD COLUMN IF NOT EXISTS price NUMERIC;
        `);

        console.log('Columns added successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Failed to add columns:', err);
        process.exit(1);
    }
};

up();
