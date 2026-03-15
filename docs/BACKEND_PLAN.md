# Brotusphere Backend Implementation Plan

## Project Overview
E-commerce backend for Brotusphere (Sour Fig products) with shopping cart, PayPal payments, stock management, and shipping tracking.

---

## Architecture

### Tech Stack Recommendation
- **Runtime:** Node.js with Express
- **Database:** PostgreSQL (for relational data: orders, products, inventory)
- **Payment:** PayPal SDK
- **Authentication:** JWT tokens
- **Deployment:** Netlify Functions (serverless) or separate Node server

### Project Structure
```
backend/
├── src/
│   ├── config/         # Environment variables, DB config
│   ├── controllers/    # Request handlers
│   ├── models/        # Database schemas
│   ├── routes/        # API endpoints
│   ├── services/      # Business logic (PayPal, email, etc.)
│   └── middleware/    # Auth, validation, error handling
├── netlify/functions/ # Serverless functions (if using Netlify)
└── package.json
```

---

## Core Features

### 1. Product Management
- Product CRUD (Create, Read, Update, Delete)
- Product variants (sizes, quantities)
- Product images
- Pricing

### 2. Shopping Cart
- Add/remove items
- Update quantities
- Persistent cart (localStorage + DB for logged-in users)
- Price calculations with tax/shipping

### 3. Stock Management
- Real-time inventory tracking
- Low stock alerts
- Stock reservation (during checkout)
- Auto-release on checkout abandonment

### 4. PayPal Integration
- PayPal Checkout SDK
- Order creation
- Payment capture
- Refund handling
- Webhook for payment confirmation

### 5. Order Management
- Order creation
- Order status tracking
- Order history

### 6. Shipping
- Shipping method selection
- Shipping rate calculation
- Tracking number integration
- Delivery status updates

---

## Database Schema

### Products Table
```sql
id: UUID PRIMARY KEY
name: VARCHAR(255)
description: TEXT
price: DECIMAL(10,2)
stock: INTEGER
sku: VARCHAR(50)
category: VARCHAR(100)
images: JSON[]
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

### Orders Table
```sql
id: UUID PRIMARY KEY
user_id: UUID (optional, for guests use null)
status: ENUM('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled')
total: DECIMAL(10,2)
shipping_address: JSON
paypal_order_id: VARCHAR(50)
paypal_transaction_id: VARCHAR(50)
tracking_number: VARCHAR(100)
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

### Order Items Table
```sql
id: UUID PRIMARY KEY
order_id: UUID FOREIGN KEY
product_id: UUID FOREIGN KEY
quantity: INTEGER
unit_price: DECIMAL(10,2)
```

### Stock Movements Table
```sql
id: UUID PRIMARY KEY
product_id: UUID FOREIGN KEY
quantity_change: INTEGER
type: ENUM('sale', 'restock', 'adjustment', 'return')
reference_id: UUID (order_id for sales)
created_at: TIMESTAMP
```

---

## API Endpoints

### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Cart
- `GET /api/cart` - Get cart contents
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:itemId` - Update quantity
- `DELETE /api/cart/:itemId` - Remove item
- `DELETE /api/cart` - Clear cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - List user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/tracking` - Update tracking (admin)

### PayPal
- `POST /api/paypal/create-order` - Create PayPal order
- `POST /api/paypal/capture-order` - Capture payment
- `POST /api/paypal/webhook` - PayPal webhook handler

### Stock
- `GET /api/stock/:productId` - Get stock level
- `POST /api/stock/adjust` - Adjust stock (admin)

---

## PayPal Integration Flow

### 1. Create Order (Frontend → Backend)
```
Frontend sends cart → Backend validates stock → 
Backend calls PayPal API → Returns order ID
```

### 2. Capture Payment (Frontend → Backend)
```
Frontend redirects to PayPal → User approves → 
Frontend calls capture → Backend verifies → 
Backend creates order, reduces stock → Returns success
```

### 3. Webhook (PayPal → Backend)
```
PayPal sends webhook → Backend verifies signature →
Backend updates order status → Sends confirmation email
```

---

## Implementation Phases

### Phase 1: Foundation
- [ ] Set up Node.js project
- [ ] Configure PostgreSQL database
- [ ] Create product models and CRUD
- [ ] Basic product API

### Phase 2: Shopping Cart
- [ ] Cart API endpoints
- [ ] Cart persistence
- [ ] Price calculations

### Phase 3: Stock Management
- [ ] Stock tracking
- [ ] Stock reservation during checkout
- [ ] Low stock notifications

### Phase 4: PayPal Integration
- [ ] PayPal sandbox setup
- [ ] Create/capture order endpoints
- [ ] Webhook handler
- [ ] Error handling

### Phase 5: Shipping
- [ ] Shipping address collection
- [ ] Shipping method selection
- [ ] Tracking number entry (admin)

### Phase 6: Polish
- [ ] Order confirmation emails
- [ ] Admin dashboard basics
- [ ] Error logging
- [ ] API documentation

---

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/brotusphere

# PayPal
PAYPAL_CLIENT_ID=your_client_id
PAYPAL_CLIENT_SECRET=your_client_secret
PAYPAL_MODE=sandbox  # or 'live'

# App
JWT_SECRET=your_jwt_secret
APP_URL=https://brotusphere.com
```

---

## Security Considerations

1. **API Keys:** Store in environment variables, never commit
2. **PayPal Webhooks:** Verify webhook signatures
3. **Input Validation:** Sanitize all user inputs
4. **Stock Race Conditions:** Use database transactions
5. **HTTPS:** Force SSL in production

---

## Testing Strategy

1. **Unit Tests:** Service functions, utilities
2. **Integration Tests:** API endpoints
3. **PayPal Sandboxing:** Test full payment flow
4. **Stock Tests:** Concurrent purchase scenarios

---

## Next Steps

1. Create GitHub repository for backend
2. Set up development environment
3. Begin Phase 1 implementation
