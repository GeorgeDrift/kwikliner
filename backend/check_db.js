require('dotenv').config();
const pool = require('./db');

async function checkDatabase() {
  try {
    console.log('Checking database...\n');

    // Check tables
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('Available tables:');
    tables.rows.forEach(t => console.log('  -', t.table_name));

    // Check shipments
    console.log('\n--- SHIPMENTS TABLE ---');
    try {
      const shipments = await pool.query('SELECT * FROM shipments LIMIT 5');
      console.log(`Total records: ${shipments.rows.length}`);
      if (shipments.rows.length > 0) {
        console.log('Sample:', shipments.rows[0]);
      }
    } catch (e) {
      console.log('Error fetching shipments:', e.message);
    }

    // Check shipment statuses
    console.log('\n--- SHIPMENT STATUSES ---');
    try {
      const statuses = await pool.query(`
        SELECT DISTINCT status, COUNT(*) as count 
        FROM shipments 
        GROUP BY status
      `);
      console.log('Status counts:');
      statuses.rows.forEach(s => console.log(`  ${s.status}: ${s.count}`));
    } catch (e) {
      console.log('Error:', e.message);
    }

    // Check products
    console.log('\n--- PRODUCTS TABLE ---');
    try {
      const products = await pool.query('SELECT COUNT(*) as count FROM products');
      console.log(`Total: ${products.rows[0].count}`);
    } catch (e) {
      console.log('Error:', e.message);
    }

    // Test the actual query
    console.log('\n--- TEST CARGO QUERY ---');
    try {
      const cargo = await pool.query(`
        SELECT * FROM shipments 
        WHERE status IN ('Bidding Open', 'Finding Driver', 'Open to Bids', 'Posted', 'Active')
        LIMIT 5
      `);
      console.log(`Found ${cargo.rows.length} cargo items with target statuses`);
      if (cargo.rows.length > 0) {
        console.log('Sample:', cargo.rows[0]);
      }
    } catch (e) {
      console.log('Error:', e.message);
    }

    process.exit(0);
  } catch (err) {
    console.error('Fatal error:', err);
    process.exit(1);
  }
}

checkDatabase();
