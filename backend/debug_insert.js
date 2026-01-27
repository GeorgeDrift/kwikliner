const pool = require('./db');

async function testAddVehicle() {
    const ownerId = 'be37fa1a-0b25-436f-9255-c776c788256a'; // Using george tembo's ID
    const vehicleData = {
        make: 'Testing',
        model: 'Insertion',
        plate: 'TEST-' + Date.now(),
        type: 'Flatbed',
        capacity: '30T',
        image: 'http://example.com/img.png'
    };

    try {
        console.log("Testing Logistics insertion...");
        const { make, model, plate, type, capacity, image } = vehicleData;
        const res1 = await pool.query(
            'INSERT INTO vehicles (owner_id, make, model, plate, type, capacity, image) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [ownerId, make, model, plate, type, capacity, image]
        );
        console.log("Logistics insertion SUCCESS:", res1.rows[0]);
    } catch (err) {
        console.error("Logistics insertion FAILED:", err.message);
    }

    try {
        console.log("\nTesting Driver/Broadcast insertion (where plate is missing)...");
        await pool.query(`
            INSERT INTO vehicles (owner_id, make, model, type, capacity, image)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [ownerId, 'Driver', 'Test', 'Truck', '15T', 'http://img.png']);
        console.log("Driver insertion SUCCESS");
    } catch (err) {
        console.error("Driver insertion FAILED:", err.message);
    }

    process.exit();
}

testAddVehicle();
