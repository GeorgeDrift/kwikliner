const pool = require('./db');

async function testInsert() {
    const shipperId = '4b4732fb-1c15-458f-acfe-06c8eb890768';
    try {
        console.log("Adding 4 more test shipments...");
        for (let i = 1; i <= 4; i++) {
            const id = `#KW-DEBUG-${Math.floor(100000 + Math.random() * 900000)}`;
            const route = "Test Origin to Test Destination " + i;
            await pool.query(
                `INSERT INTO shipments (id, shipper_id, route, cargo, weight, price, status) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [id, shipperId, route, 'Debug Cargo ' + i, 10, 50000, 'Bidding Open']
            );
            console.log(`Inserted: ${id}`);
        }
        console.log("Success!");
    } catch (err) {
        console.error("INSERT ERROR:", err);
    } finally {
        process.exit();
    }
}

testInsert();
