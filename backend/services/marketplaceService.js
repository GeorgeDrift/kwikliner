const pool = require('../db');

const marketplaceService = {
    getItems: async () => {
        const result = await pool.query(`
            SELECT * FROM marketplace_items 
            WHERE status = 'Active' 
            ORDER BY created_at DESC 
            LIMIT 100
        `);
        return result.rows;
    },

    syncShipment: async (shipment) => {
        // Map shipment fields to marketplace fields
        const { id, shipper_id, route, cargo, weight, price, status, images, quantity } = shipment;

        // Sanitize price for Numeric column
        const cleanPrice = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.]/g, '')) : parseFloat(price);
        const safePrice = isNaN(cleanPrice) ? 0 : cleanPrice;

        await pool.query(`
            INSERT INTO marketplace_items (
                external_id, type, title, description, price, price_str, 
                location, images, owner_id, provider_name, status, metadata
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            ON CONFLICT (external_id) DO UPDATE SET
                title = EXCLUDED.title,
                description = EXCLUDED.description,
                price = EXCLUDED.price,
                price_str = EXCLUDED.price_str,
                location = EXCLUDED.location,
                images = EXCLUDED.images,
                status = EXCLUDED.status,
                metadata = EXCLUDED.metadata
        `, [
            id, 'Cargo', cargo, `Shipment route: ${route}`,
            safePrice, safePrice > 0 ? `MWK ${Number(safePrice).toLocaleString()}` : 'Open to Bids',
            route, images, shipper_id, 'Verified Shipper',
            ['Bidding Open', 'Finding Driver'].includes(status) ? 'Active' : 'Closed',
            JSON.stringify({ weight, quantity })
        ]);
    },

    removeItem: async (externalId) => {
        await pool.query('UPDATE marketplace_items SET status = $1 WHERE external_id = $2', ['Removed', externalId]);
    },

    syncVehicle: async (vehicle) => {
        const { id, driver_id, driver_name, vehicle_type, capacity, route, price, images, location, manufacturer, model } = vehicle;
        const title = manufacturer && model ? `${manufacturer} ${model}` : vehicle_type;
        const description = `Capacity: ${capacity} | Hub: ${location || route}`;

        // Sanitize price for Numeric column
        const cleanPrice = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.]/g, '')) : parseFloat(price);
        const safePrice = isNaN(cleanPrice) ? 0 : cleanPrice;

        await pool.query(`
            INSERT INTO marketplace_items (
                external_id, type, title, description, price, price_str, 
                location, images, owner_id, provider_name, status, metadata
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            ON CONFLICT (external_id) DO UPDATE SET
                title = EXCLUDED.title,
                description = EXCLUDED.description,
                price = EXCLUDED.price,
                price_str = EXCLUDED.price_str,
                location = EXCLUDED.location,
                images = EXCLUDED.images,
                status = EXCLUDED.status,
                metadata = EXCLUDED.metadata
        `, [
            id, 'Transport/Logistics', title, description,
            safePrice, safePrice > 0 ? `MWK ${Number(safePrice).toLocaleString()}` : price,
            location || route, images, driver_id, driver_name,
            'Active',
            JSON.stringify({ capacity, route, manufacturer, model, vehicle_type, location })
        ]);
    },

    syncProduct: async (product) => {
        const { id, owner_id, name, description, price, images, category, seller } = product;
        await pool.query(`
            INSERT INTO marketplace_items (
                external_id, type, title, description, price, price_str, 
                location, images, owner_id, provider_name, status, metadata
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            ON CONFLICT (external_id) DO UPDATE SET
                title = EXCLUDED.title,
                description = EXCLUDED.description,
                price = EXCLUDED.price,
                price_str = EXCLUDED.price_str,
                location = EXCLUDED.location,
                images = EXCLUDED.images,
                status = EXCLUDED.status,
                metadata = EXCLUDED.metadata
        `, [
            id, 'Hardware', name, description,
            price, `MWK ${Number(price).toLocaleString()}`,
            'Storefront', images, owner_id, seller || 'Verified Seller',
            'Active',
            JSON.stringify({ category })
        ]);
    }
};

module.exports = marketplaceService;
