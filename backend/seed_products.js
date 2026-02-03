const pool = require('./db');
const marketplaceService = require('./services/marketplaceService');

async function seedProducts() {
    const ownerId = '44dcf150-bc46-48e5-9fd3-a2c1330fe875'; // Hardware Harry

    const products = [
        {
            name: 'Industrial Safety Helmet',
            price: 15500,
            stock: 50,
            category: 'Safety',
            image: 'https://images.unsplash.com/photo-1591955506264-3f5a68217f26?q=80&w=2070&auto=format&fit=crop',
            description: 'High-impact resistant safety helmet for construction and industrial use.'
        },
        {
            name: 'Steel Toe Work Boots',
            price: 45000,
            stock: 25,
            category: 'Safety',
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop',
            description: 'Durable leather work boots with steel toe protection and slip-resistant soles.'
        },
        {
            name: 'Heavy Duty Solar Panel - 400W',
            price: 280000,
            stock: 10,
            category: 'Tech',
            image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2070&auto=format&fit=crop',
            description: 'High-efficiency monocrystalline solar panel for residential and commercial use.'
        },
        {
            name: 'Electric Impact Drill',
            price: 85000,
            stock: 15,
            category: 'Hardware',
            image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=2070&auto=format&fit=crop',
            description: 'Powerful 750W impact drill with variable speed and hammer function.'
        },
        {
            name: 'Galvanized Steel Nails (1kg)',
            price: 3500,
            stock: 100,
            category: 'Hardware',
            image: 'https://images.unsplash.com/photo-1586864387917-f579ae5259fb?q=80&w=2070&auto=format&fit=crop',
            description: 'Rust-resistant galvanized nails for construction and carpentry.'
        }
    ];

    try {
        console.log("Seeding products...");
        for (const p of products) {
            const res = await pool.query(
                `INSERT INTO products (owner_id, name, price, stock_quantity, category, images, description) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7) 
                 RETURNING id`,
                [ownerId, p.name, p.price, p.stock, p.category, [p.image], p.description]
            );

            const productId = res.rows[0].id;
            console.log(`Successfully added product: ${p.name}`);

            // Sync with marketplace
            await marketplaceService.syncProduct({
                id: productId,
                owner_id: ownerId,
                name: p.name,
                description: p.description,
                price: p.price,
                images: [p.image],
                category: p.category,
                seller: 'Harrys Hardware'
            });
        }
        console.log("Seeding products complete!");
        process.exit(0);
    } catch (err) {
        console.error("Seeding failed:", err);
        process.exit(1);
    }
}

seedProducts();
