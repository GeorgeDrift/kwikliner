const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

pool.query('SELECT NOW()', async (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('PostgreSQL Connected Successfully');
    await ensureSchema();
  }
});

const ensureSchema = async () => {
  try {
    const client = await pool.connect();
    try {
      console.log('Verifying Schema...');

      // Fix Shipments Table
      await client.query(`
        ALTER TABLE shipments 
        ADD COLUMN IF NOT EXISTS origin VARCHAR(255),
        ADD COLUMN IF NOT EXISTS destination VARCHAR(255),
        ADD COLUMN IF NOT EXISTS quantity VARCHAR(100),
        ADD COLUMN IF NOT EXISTS images TEXT[],
        ADD COLUMN IF NOT EXISTS weight FLOAT;
      `);

      // Fix Users Table
      await client.query(`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS rating FLOAT DEFAULT 5.0;
      `);

      // Create Central Marketplace Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS marketplace_items (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          external_id VARCHAR(255) UNIQUE, -- Link to shipments.id or vehicle_id
          type VARCHAR(50) NOT NULL, -- 'Cargo', 'Transport', 'Hardware', 'Service'
          title VARCHAR(255) NOT NULL,
          description TEXT,
          price NUMERIC,
          price_str VARCHAR(100),
          location VARCHAR(255),
          images TEXT[],
          owner_id UUID,
          provider_name VARCHAR(255),
          status VARCHAR(50) DEFAULT 'Active',
          metadata JSONB DEFAULT '{}',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('Schema verification complete: Marketplace and Shipments tables ensured.');

    } catch (dbErr) {
      console.error('Schema update failed:', dbErr.message);
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Failed to acquire client for schema check:', err.message);
  }
};

module.exports = pool;
