const { Pool } = require('pg');

const connectionString = process.env.NEON_DATABASE;

if (!connectionString) {
  console.error('NEON_DATABASE environment variable is not set');
}

const sslConfig = process.env.NODE_ENV === 'development' 
  ? { rejectUnauthorized: false }
  : { rejectUnauthorized: true };

const pool = new Pool({
  connectionString,
  ssl: sslConfig
});

async function query(text, params) {
  if (!connectionString) {
    throw new Error('Database not configured - NEON_DATABASE is not set');
  }
  
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('Executed query', { text: text.substring(0, 50), duration, rows: res.rowCount });
  return res;
}

async function getClient() {
  if (!connectionString) {
    throw new Error('Database not configured - NEON_DATABASE is not set');
  }
  const client = await pool.connect();
  return client;
}

async function withTransaction(callback) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

module.exports = { pool, query, getClient, withTransaction };
