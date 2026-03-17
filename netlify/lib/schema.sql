-- Database Schema for Brotusphere E-commerce

-- User profiles table (extends Neon's auth)
-- Links to Neon auth via neon.users table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    neon_user_id UUID NOT NULL,  -- References neon.users.id
    email VARCHAR(255) UNIQUE,
    name VARCHAR(255),
    phone VARCHAR(50),
    role VARCHAR(20) DEFAULT 'customer',  -- 'admin', 'staff', 'customer'
    default_shipping_address TEXT,
    default_city VARCHAR(100),
    default_postal_code VARCHAR(20),
    default_country VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INTEGER DEFAULT 0,
    sku VARCHAR(50) UNIQUE,
    category VARCHAR(100),
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_profiles(id),
    status VARCHAR(50) DEFAULT 'pending',
    total DECIMAL(10,2) NOT NULL,
    shipping_name VARCHAR(255),
    shipping_address TEXT,
    shipping_address2 TEXT,
    shipping_city VARCHAR(100),
    shipping_postal_code VARCHAR(20),
    shipping_country VARCHAR(100),
    billing_name VARCHAR(255),
    billing_address TEXT,
    billing_address2 TEXT,
    billing_city VARCHAR(100),
    billing_postal_code VARCHAR(20),
    billing_country VARCHAR(100),
    payer_email VARCHAR(255),
    paypal_order_id VARCHAR(50),
    paypal_transaction_id VARCHAR(50),
    tracking_number VARCHAR(100),
    tracking_carrier VARCHAR(50),
    fulfilled_at TIMESTAMP WITH TIME ZONE,
    received_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stock movements table
CREATE TABLE IF NOT EXISTS stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id),
    quantity_change INTEGER NOT NULL,
    type VARCHAR(50) NOT NULL,
    reference_id UUID,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_product_id ON stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_neon_id ON user_profiles(neon_user_id);

-- Insert sample products (prices in USD, ~ZAR/18)
INSERT INTO products (name, description, price, stock, sku, category, image_url) VALUES
('Sour Fig Jam', 'Traditional recipe passed down generations', 4.72, 50, 'SFJ001', 'Preserves', '/images/edulis.webp'),
('Sour Fig Honey', 'Natural sweetness with a tangy twist', 6.67, 30, 'SFH001', 'Honey', '/images/brotus.webp'),
('Sour Fig Tea', 'Soothing herbal infusion', 3.61, 40, 'SFT001', 'Tea', '/images/carpo.webp'),
('Sour Fig Skin Salve', 'Natural skin care product', 5.28, 25, 'SFS001', 'Skincare', '/images/edulis.webp'),
('Sour Fig Chutney', 'Tangy condiment', 4.17, 35, 'SFC001', 'Preserves', '/images/brotus.webp'),
('Sour Fig Gift Set', 'Collection of sour fig products', 13.89, 15, 'SFG001', 'Gifts', '/images/carpo.webp')
ON CONFLICT (sku) DO NOTHING;
