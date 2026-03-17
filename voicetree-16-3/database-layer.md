---
color: red
isContextNode: false
agent_name: Ayu
---
# 1. Connection Pool

PostgreSQL connection pool with Neon SSL config

**Purpose:** PostgreSQL connection pool using `pg` library with Neon database URL. SSL configured with `rejectUnauthorized: false`.

```javascript
const pool = new Pool({
  connectionString: process.env.NEON_DATABASE,
  ssl: { rejectUnauthorized: false }
});
```

## Diagram

```mermaid
graph TD
    ENV[NEON_DATABASE] --> Pool
    Pool --> SSL[SSL: rejectUnauthorized: false]
    SSL --> Neon[Neon PostgreSQL]
```

### NOTES

- SSL bypass is security trade-off
- No max/min pool size configured

[[database-layer]]
