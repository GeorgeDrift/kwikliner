const pool = require('./db');

const reset = async () => {
    try {
        console.log('Resetting database...');

        // Truncate all tables in reverse dependency order
        const tables = [
            'subscriptions',
            'service_bookings',
            'documents',
            'notifications',
            'transactions',
            'messages',
            'products',
            'bids',
            'shipments',
            'vehicle_listings',
            'vehicles',
            'wallets',
            'users'
        ];

        for (const table of tables) {
            console.log(`Truncating ${table}...`);
            await pool.query(`TRUNCATE TABLE ${table} CASCADE`);
        }

        console.log('Database reset successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Failed to reset database:', err);
        process.exit(1);
    }
};

reset();
