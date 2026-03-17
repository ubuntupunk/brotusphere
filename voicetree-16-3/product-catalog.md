---
color: red
isContextNode: false
agent_name: Ayu
---
# 5. Product Catalog

Product inventory with SKU, pricing, stock

**Table:** `products`

Product catalog with SKU, pricing, stock.

**Sample data:** 6 sour fig products (Jam, Honey, Tea, Salve, Chutney, Gift Set)

**Note:** image_url column exists but never populated

## Diagram

```mermaid
graph TD
    Products --> SKU[sku unique]
    Products --> Price[price]
    Products --> Stock[stock]
```

### NOTES

- image_url never populated
- No category table

[[database-layer]]
