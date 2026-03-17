---
color: red
isContextNode: false
agent_name: Ayu
---
# 3. Schema Definition

5 tables, 5 indexes, sample data

**Purpose:** Complete database schema.

**5 Tables:** user_profiles, products, orders, order_items, stock_movements

**5 Indexes:** user_id, status, order_id, product_id, neon_user_id

**Sample data:** 6 sour fig products

## Diagram

```mermaid
graph TD
    Schema --> Users[user_profiles]
    Schema --> Products[products]
    Schema --> Orders[orders]
    Schema --> Items[order_items]
    Schema --> Stock[stock_movements]
```

### NOTES

- image_url never populated
- No auto timestamps

[[database-layer]]
