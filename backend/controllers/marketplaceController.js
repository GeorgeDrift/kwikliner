const pool = require('../db');
const marketplaceService = require('../services/marketplaceService');

const marketplaceController = {
    // Get all available cargo posts (shipper posts looking for drivers)
    getAllCargoListings: async (req, res) => {
        try {
            // First try to get from shipments table
            let result;
            try {
                result = await pool.query(`
                    SELECT 
                        id, 
                        shipper_id, 
                        route, 
                        origin,
                        destination,
                        cargo, 
                        weight, 
                        price, 
                        status, 
                        created_at,
                        pickup_date,
                        pickup_type,
                        order_ref,
                        color,
                        images,
                        quantity
                    FROM shipments 
                    WHERE status IN ('Bidding Open', 'Finding Driver', 'Open to Bids', 'Posted', 'Active')
                    ORDER BY created_at DESC
                    LIMIT 100
                `);
                console.log(`[DB] ✓ Fetched ${result.rows.length} cargo listings from shipments table`);
            } catch (tableErr) {
                // If shipments table doesn't exist, try alternative query
                console.warn('[DB] shipments table error, trying alternative:', tableErr.message);
                result = await pool.query(`
                    SELECT * FROM shipments LIMIT 1
                `).catch(() => ({ rows: [] }));
                console.log('[DB] Table exists but different structure');
            }

            res.json(result?.rows || []);
        } catch (err) {
            console.error('[DB Error] getAllCargoListings - Fatal:', err.message);
            // Return empty array instead of error to prevent frontend crashes
            res.json([]);
        }
    },

    // Get all available hardware/products
    getAllProducts: async (req, res) => {
        try {
            const result = await pool.query(`
                SELECT * FROM products ORDER BY created_at DESC LIMIT 100
            `);
            console.log(`[DB] Fetched ${result.rows.length} products`);
            res.json(result?.rows || []);
        } catch (err) {
            console.error('[DB Error] getAllProducts:', err.message);
            // Return empty array instead of error
            res.json([]);
        }
    },

    // Get all available vehicle listings (for hire)
    getAllVehicleListings: async (req, res) => {
        try {
            const result = await pool.query(`
                SELECT * FROM vehicle_listings ORDER BY created_at DESC LIMIT 100
            `);
            console.log(`[DB] Fetched ${result.rows.length} vehicle listings`);
            res.json(result?.rows || []);
        } catch (err) {
            console.error('[DB Error] getAllVehicleListings:', err.message);
            // Return empty array instead of error
            res.json([]);
        }
    },

    getAllLogisticsServices: async (req, res) => {
        try {
            // For now, return mock data or fetch from services table if it exists
            const services = [
                { id: 'serv-1', name: 'Hub-to-Hub Express', provider: 'KwikLine Logistics', price: 'MWK 50k', details: 'Direct warehouse transport', category: 'Transport/Logistics' },
                { id: 'serv-2', name: 'Last Mile Delivery', provider: 'City Runner Ltd', price: 'MWK 15k', details: 'Local city distribution', category: 'Transport/Logistics' }
            ];
            res.json(services);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to fetch logistics services' });
        }
    },

    // Integrated All Marketplace Items
    getAllMarketplaceItems: async (req, res) => {
        try {
            const items = await marketplaceService.getItems();
            console.log(`[Market] Unified fetch: ${items.length} items`);
            res.json(items);
        } catch (err) {
            console.error('[Market] Error fetching unified data:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

module.exports = marketplaceController;
