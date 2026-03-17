---
color: red
isContextNode: false
agent_name: Ayu
---
# 4. User Profiles

Extended user data linked to Neon auth

**Table:** `user_profiles`

Extended user data linked to Neon auth.

**Columns:** id, neon_user_id, name, phone, default_shipping_address/city/postal_code/country, timestamps

## Diagram

```mermaid
graph TD
    UserProfile --> NeonAuth[neon.users]
    UserProfile --> Shipping[default shipping]
```

### NOTES

- No cascade delete

[[database-layer]]
