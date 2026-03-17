const pool = require('../lib/db.js');
const { verifyAdminKey, authError } = require('../lib/auth.js');

const schema = `
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    default_shipping_address TEXT,
    default_city VARCHAR(100),
    default_postal_code VARCHAR(20),
    default_country VARCHAR(100),
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id),
    quantity_change INTEGER NOT NULL,
    type VARCHAR(50) NOT NULL,
    reference_id UUID,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_product_id ON stock_movements(product_id);
`;

const insertProducts = `
INSERT INTO products (name, description, price, stock, sku, category) VALUES
('Sour Fig Jam', 'Traditional recipe passed down generations', 4.72, 50, 'SFJ001', 'Preserves'),
('Sour Fig Honey', 'Natural sweetness with a tangy twist', 6.67, 30, 'SFH001', 'Honey'),
('Sour Fig Tea', 'Soothing herbal infusion', 3.61, 40, 'SFT001', 'Tea'),
('Sour Fig Skin Salve', 'Natural skin care product', 5.28, 25, 'SFS001', 'Skincare'),
('Sour Fig Chutney', 'Tangy condiment', 4.17, 35, 'SFC001', 'Preserves'),
('Sour Fig Gift Set', 'Collection of sour fig products', 13.89, 15, 'SFG001', 'Gifts')
ON CONFLICT (sku) DO NOTHING;
`;

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return authError('Method Not Allowed', 405);
  }

  const adminCheck = verifyAdminKey(event);
  if (!adminCheck.authorized) {
    return authError(adminCheck.reason, 403);
  }

  try {
    // Create tables
    const statements = schema.split(';').filter(s => s.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await pool.query(statement);
      }
    }

    // Insert sample products
    const productStatements = insertProducts.split(';').filter(s => s.trim());
    for (const statement of productStatements) {
      if (statement.trim()) {
        await pool.query(statement);
      }
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, message: 'Database initialized' })
    };
  } catch (error) {
    console.error('Init error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message })
    };
  }
};
