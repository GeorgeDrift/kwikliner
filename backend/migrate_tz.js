const pool = require('./db');

async function migrate() {
    try {
        console.log('Migrating users.verification_expires_at to TIMESTAMP WITH TIME ZONE...');
        await pool.query('ALTER TABLE users ALTER COLUMN verification_expires_at TYPE TIMESTAMP WITH TIME ZONE;');
        console.log('Migration successful!');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        pool.end();
    }
}

migrate();
