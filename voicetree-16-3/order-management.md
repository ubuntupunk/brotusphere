---
color: red
isContextNode: false
agent_name: Ayu
---
# 6. Order Management

Orders + items with PayPal tracking

**Tables:** `orders` + `order_items`

Order management with PayPal integration.

**orders:** user, status, total, shipping, PayPal (order_id, transaction_id), tracking, notes

**order_items:** order_id, product_id, quantity, unit_price

## Diagram

```mermaid
graph TD
    Orders --> PayPal[paypal_order_id, transaction_id]
    Orders --> Tracking[tracking_number, carrier]
    OrderItems --> Product[product_id]
```

### NOTES

- No order status history
- Status plain text

[[database-layer]]
