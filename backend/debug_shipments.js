const pool = require('./db');
const { v4: uuidv4 } = require('uuid');

async function checkDatabase() {
    try {
        console.log('Connecting to database...');

        // 1. Check Shipments
        const shipments = await pool.query('SELECT * FROM shipments');
        console.log('---------------------------------------------------');
        console.log(`[SHIPMENTS] Found ${shipments.rows.length} records:`);
        shipments.rows.forEach(row => {
            console.log(`ID: ${row.id}, Status: ${row.status}, Bidder_IDs: ${JSON.stringify(row.bidder_ids)}`);
        });

        // 2. Check Drivers
        const drivers = await pool.query("SELECT * FROM users WHERE role = 'DRIVER' LIMIT 1");
        if (drivers.rows.length === 0) {
            console.log('[DRIVERS] No drivers found.');
        } else {
            const driver = drivers.rows[0];
            console.log('---------------------------------------------------');
            console.log(`[DRIVER] Testing query for Driver: ${driver.name} (ID: ${driver.id})`);

            // 3. Emulate the Service Query
            try {
                const query = `
                    SELECT *, 
                    (bidder_ids @> ARRAY[$1]::UUID[]) as has_bid
                    FROM shipments 
                    WHERE status IN ('Bidding Open', 'Finding Driver')
                    ORDER BY created_at DESC
                `;
                const res = await pool.query(query, [driver.id]);
                console.log(`[QUERY RESULT] Found ${res.rows.length} matches for this driver.`);
                res.rows.forEach(r => console.log(` - Matched Shipment: ${r.id}`));
            } catch (qErr) {
                console.error('[QUERY ERROR]', qErr.message);
                // Fallback attempt without UUID cast if that failed
                try {
                    console.log('[RETRY] Attempting query without explicit UUID cast...');
                    const query2 = `
                        SELECT *, 
                        (bidder_ids @> ARRAY[$1]) as has_bid
                        FROM shipments 
                        WHERE status IN ('Bidding Open', 'Finding Driver')
                        ORDER BY created_at DESC
                    `;
                    const res2 = await pool.query(query2, [driver.id]);
                    console.log(`[RETRY RESULT] Found ${res2.rows.length} matches.`);
                } catch (qErr2) {
                    console.error('[RETRY ERROR]', qErr2.message);
                }
            }
        }

        pool.end();
    } catch (err) {
        console.error('General Error:', err);
    }
}

checkDatabase();
