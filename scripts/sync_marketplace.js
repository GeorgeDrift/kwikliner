const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });
const pool = require('../backend/db');

const syncMarketplace = async () => {
    console.log('🔄 Starting Marketplace Backfill...');

    try {
        // 1. Sync Shipments (Cargo)
        const shipments = await pool.query("SELECT * FROM shipments WHERE status IN ('Bidding Open', 'Finding Driver')");
        console.log(`📦 Found ${shipments.rows.length} active shipments.`);

        for (const s of shipments.rows) {
            const cleanPrice = typeof s.price === 'string' ? parseFloat(s.price.replace(/[^0-9.]/g, '')) : parseFloat(s.price);
            const safePrice = isNaN(cleanPrice) ? 0 : cleanPrice;

            await pool.query(`
                INSERT INTO marketplace_items (
                    external_id, type, title, description, price, price_str, 
                    location, images, owner_id, provider_name, status, metadata, created_at
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                ON CONFLICT (external_id) DO UPDATE SET status = 'Active'
            `, [
                s.id, 'Cargo', s.cargo, `Shipment route: ${s.route}`,
                safePrice, safePrice > 0 ? `MWK ${Number(safePrice).toLocaleString()}` : 'Open to Bids',
                s.route, s.images || [], s.shipper_id, 'Verified Shipper',
                'Active', JSON.stringify({ weight: s.weight, quantity: s.quantity }), s.created_at
            ]);
        }

        // 2. Sync Products (Hardware)
        const products = await pool.query("SELECT p.*, u.name as seller_name FROM products p JOIN users u ON p.owner_id = u.id");
        console.log(`🛠️ Found ${products.rows.length} products.`);

        for (const p of products.rows) {
            await pool.query(`
                INSERT INTO marketplace_items (
                    external_id, type, title, description, price, price_str, 
                    location, images, owner_id, provider_name, status, metadata, created_at
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                ON CONFLICT (external_id) DO UPDATE SET status = 'Active', provider_name = EXCLUDED.provider_name
            `, [
                p.id, 'Hardware', p.name, p.description,
                Number(p.price), `MWK ${Number(p.price).toLocaleString()}`,
                'Storefront', p.images || [], p.owner_id, p.seller_name || 'Verified Seller',
                'Active', JSON.stringify({ category: p.category }), p.created_at
            ]);
        }

        // 3. Sync Vehicles (Logistics/Drivers)
        const vehicles = await pool.query("SELECT * FROM vehicle_listings");
        console.log(`🚛 Found ${vehicles.rows.length} vehicle listings.`);

        for (const v of vehicles.rows) {
            const title = v.manufacturer && v.model ? `${v.manufacturer} ${v.model}` : v.vehicle_type;
            const description = `Capacity: ${v.capacity} | Hub: ${v.location || v.route}`;
            const cleanPrice = typeof v.price === 'string' ? parseFloat(v.price.replace(/[^0-9.]/g, '')) : parseFloat(v.price);
            const safePrice = isNaN(cleanPrice) ? 0 : cleanPrice;

            await pool.query(`
                INSERT INTO marketplace_items (
                    external_id, type, title, description, price, price_str, 
                    location, images, owner_id, provider_name, status, metadata, created_at
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                ON CONFLICT (external_id) DO UPDATE SET status = 'Active'
            `, [
                v.id, 'Transport/Logistics', title, description,
                safePrice, safePrice > 0 ? `MWK ${Number(safePrice).toLocaleString()}` : v.price,
                v.location || v.route, v.images || [], v.driver_id, v.driver_name,
                'Active',
                JSON.stringify({
                    capacity: v.capacity,
                    route: v.route,
                    manufacturer: v.manufacturer,
                    model: v.model,
                    vehicle_type: v.vehicle_type,
                    location: v.location
                }), v.created_at
            ]);
        }

        console.log('✅ Backfill Complete! All items synced to Marketplace.');
    } catch (err) {
        console.error('❌ Backfill Failed:', err);
    } finally {
        pool.end();
    }
};

syncMarketplace();
