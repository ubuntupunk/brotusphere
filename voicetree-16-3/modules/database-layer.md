---
color: red
isContextNode: false
parentNodeId: /home/ubuntupunk/Projects/brotusphere/voicetree-16-3/run_me.md
status: claimed
---
# Database Layer

**Path:** `netlify/lib/`

**Purpose:** Database connection and utilities

---

## Module Summary

The Database Layer provides PostgreSQL connection pooling and query utilities for the Brotusphere e-commerce application. It uses the `pg` library to connect to Neon PostgreSQL, supporting operations across user profiles, products, orders, and inventory management.

**Key files:**
- `netlify/lib/db.js` - Connection pool and query helpers
- `netlify/lib/schema.sql` - Database schema with 5 tables and indexes
- Used by 5 Netlify functions: auth, init-db, orders, paypal, track, products

## Core Flow

```mermaid
graph TD
    subgraph "Database Layer"
        DB[Neon PostgreSQL]
        Pool[Connection Pool<br/>pg.Pool]
        Query[query() helper]
        GetClient[getClient() helper]
    end

    subgraph "Netlify Functions"
        Auth[auth.js]
        Orders[orders.js]
        Products[products.js]
        PayPal[paypal.js]
        Track[track.js]
        InitDB[init-db.js]
    end

    Pool --> DB
    Query --> Pool
    GetClient --> Pool
    
    Auth --> Query
    Orders --> Query
    Products --> Query
    PayPal --> Query
    Track --> Query
    InitDB --> Query
```

**Flow:** Netlify functions import the pool from `db.js`, use `query()` for simple operations or `getClient()` for transactions, all connecting to Neon PostgreSQL via SSL.

## Notable Gotchas / Tech Debt

1. **No connection string validation** - `db.js` uses `process.env.NEON_DATABASE` directly without checking if it exists first, causing cryptic errors if missing
2. **SSL mode `rejectUnauthorized: false`** - Bypasses SSL certificate verification (security trade-off for Neon compatibility)
3. **No query parameterization validation** - The `query()` helper passes params directly without injection checks
4. **No transaction wrapper** - Functions requiring multi-step transactions must manually call `getClient()`, `begin()`, `commit()`, `rollback()` - error-prone
5. **Missing connection pool limits** - No explicit `max`/`min` pool size settings, relies on pg defaults
6. **No prepared statement caching** - Each query may be re-parsed; could benefit from prepared statements for frequently-run queries
7. **Hardcoded sample products** - Schema includes INSERT for sample data, but no mechanism for product image URLs (column exists but never populated)

## Submodules

| # | Submodule | Files | Purpose |
|---|-----------|-------|---------|
| 1 | **Connection Pool** | `db.js` (lines 3-6) | PostgreSQL connection pool with Neon SSL config |
| 2 | **Query Utilities** | `db.js` (lines 10-21) | `query()` and `getClient()` helpers with logging |
| 3 | **Schema Definition** | `schema.sql` | 5 tables + 5 indexes + sample data |
| 4 | **User Profiles** | `schema.sql:5-16` | Extended user data linked to Neon auth |
| 5 | **Product Catalog** | `schema.sql:18-31` | Product inventory with SKU, pricing, stock |
| 6 | **Order Management** | `schema.sql:33-61` | Orders + order_items with PayPal integration fields |
| 7 | **Inventory Tracking** | `schema.sql:63-72` | Stock movements for audit trail |
