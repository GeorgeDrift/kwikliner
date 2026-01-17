const pool = require('./db');
const bcrypt = require('bcryptjs');

const seed = async () => {
    try {
        const passwordHash = await bcrypt.hash('password123', 10);

        // Seed Users
        const users = [
            ['SHIPPER', 'George Drift', 'george@drift.com', '+265 991 234 567', passwordHash, 'Drift Logistics', 'APPROVED'],
            ['DRIVER', 'John Kamwana', 'john@kamwana.com', '+265 888 765 432', passwordHash, null, 'APPROVED']
        ];

        for (const user of users) {
            await pool.query(
                'INSERT INTO users (role, name, email, phone, password_hash, company_name, compliance_status) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (email) DO NOTHING',
                user
            );
        }

        console.log('Seeding completed!');
        process.exit();
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
};

seed();
