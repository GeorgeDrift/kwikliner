const pool = require('./db');

async function debug() {
    try {
        console.log("=== USERS TABLE ===");
        const users = await pool.query("SELECT id, name, role FROM users");
        console.log(`Total users: ${users.rowCount}`);
        console.log(users.rows);

        console.log("\n=== VEHICLE LISTINGS ===");
        const listings = await pool.query("SELECT * FROM vehicle_listings");
        console.log(`Total listings: ${listings.rowCount}`);
        console.log(listings.rows);

        console.log("\n=== MARKETPLACE ITEMS ===");
        const items = await pool.query("SELECT * FROM marketplace_items WHERE type = 'Transport/Logistics'");
        console.log(`Driver items: ${items.rowCount}`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

debug();
