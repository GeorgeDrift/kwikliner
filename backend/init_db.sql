-- KwikLiner Database Initialization Script
-- Execute this in your PostgreSQL database (e.g., via psql or pgAdmin)

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'shipper', 'driver', 'logistics', 'hardware_owner', 'admin'
    company_name VARCHAR(255),
    phone VARCHAR(50),
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Vehicles Table
CREATE TABLE IF NOT EXISTS vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    plate VARCHAR(20) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL,
    capacity VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Available',
    images TEXT[], -- Array of base64 images
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create Vehicle Listings Table (for "Publish Availability")
CREATE TABLE IF NOT EXISTS vehicle_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_id UUID REFERENCES users(id) ON DELETE CASCADE,
    driver_name VARCHAR(255),
    vehicle_type VARCHAR(100),
    capacity VARCHAR(50),
    route VARCHAR(255),
    price VARCHAR(100),
    images TEXT[], -- Array of base64 images
    location VARCHAR(100),
    rating DECIMAL(2,1) DEFAULT 5.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create Shipments Table
CREATE TABLE IF NOT EXISTS shipments (
    id VARCHAR(20) PRIMARY KEY, -- e.g., #KW-123456
    shipper_id UUID REFERENCES users(id) ON DELETE CASCADE,
    driver_id UUID REFERENCES users(id),
    owner_id UUID REFERENCES users(id),
    assigned_driver_id UUID REFERENCES users(id),
    route VARCHAR(255) NOT NULL,
    cargo VARCHAR(255) NOT NULL,
    weight FLOAT,
    price DECIMAL(15, 2),
    status VARCHAR(50) DEFAULT 'Finding Driver',
    color VARCHAR(100),
    deposit_status VARCHAR(50) DEFAULT 'Pending',
    payment_timing VARCHAR(50) DEFAULT 'Deposit',
    pickup_type VARCHAR(50) DEFAULT 'Standard',
    order_ref VARCHAR(255),
    pickup_date DATE,
    bidder_ids UUID[], -- Array of drivers who bid
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Create Bids Table
CREATE TABLE IF NOT EXISTS bids (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    load_id VARCHAR(20) REFERENCES shipments(id) ON DELETE CASCADE,
    driver_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(15, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Create Bids Table...
...
-- 7. Create Wallets Table (Digital Balance)
CREATE TABLE IF NOT EXISTS wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    balance DECIMAL(15, 2) DEFAULT 0.00, -- Net balance (calculated after commission)
    currency VARCHAR(10) DEFAULT 'MWK',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Create Products Table (KwikShop)
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(15, 2) NOT NULL,
    category VARCHAR(100),
    stock_quantity INTEGER DEFAULT 0,
    images TEXT[], 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Create Messages Table (Chat System)
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    load_id VARCHAR(20) REFERENCES shipments(id) ON DELETE SET NULL,
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Create Transactions Table (Financial Tracking)
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    shipment_id VARCHAR(20) REFERENCES shipments(id) ON DELETE SET NULL,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    gross_amount DECIMAL(15, 2) NOT NULL, -- Original amount
    commission_amount DECIMAL(15, 2) NOT NULL, -- 5% KwikLiner Fee
    net_amount DECIMAL(15, 2) NOT NULL, -- Amount credited to user wallet
    type VARCHAR(50) NOT NULL, -- 'Commission Earned', 'Sale', 'Withdrawal', 'Payout'
    method VARCHAR(50), -- 'Mobile Money', 'Bank Transfer', 'Card'
    status VARCHAR(50) DEFAULT 'Pending', 
    transaction_ref VARCHAR(255) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Create Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50), -- 'Info', 'Alert', 'Success'
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Create Documents Table (Compliance/KYC)
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    doc_type VARCHAR(100) NOT NULL, -- 'ID', 'License', 'Insurance'
    doc_number VARCHAR(255),
    file_url TEXT, -- Or base64
    expiry_date DATE,
    status VARCHAR(50) DEFAULT 'Pending Review',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Create Service Bookings Table (Logistics Services)
CREATE TABLE IF NOT EXISTS service_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shipper_id UUID REFERENCES users(id) ON DELETE CASCADE,
    provider_id UUID REFERENCES users(id) ON DELETE SET NULL,
    service_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    scheduled_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Create Subscription Plans (For Drivers/Logistics Owners)
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_name VARCHAR(100), -- 'Standard', 'Premium', 'Logistics Plus'
    status VARCHAR(50) DEFAULT 'Active',
    start_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expiry_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

