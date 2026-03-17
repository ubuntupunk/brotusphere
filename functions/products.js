import pool from '../netlify/lib/db.js';
import { verifyAdminKey, authError } from '../netlify/lib/auth.js';

export async function handler(event, context) {
  // GET - List all products
  if (event.httpMethod === 'GET') {
    try {
      const result = await pool.query(`
        SELECT id, name, description, price, stock, sku, category, image_url
        FROM products
        WHERE is_active = true
        ORDER BY category, name
      `);

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: result.rows })
      };
    } catch (error) {
      console.error('Get products error:', error);
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Failed to fetch products' })
      };
    }
  }

  // POST - Create product (admin only)
  if (event.httpMethod === 'POST') {
    const adminCheck = verifyAdminKey(event);
    if (!adminCheck.authorized) {
      return authError(adminCheck.reason, 403);
    }

    const { name, description, price, stock, sku, category, imageUrl } = JSON.parse(event.body || '{}');

    if (!name || !price) {
      return authError('Name and price required', 400);
    }

    try {
      const result = await pool.query(`
        INSERT INTO products (name, description, price, stock, sku, category, image_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, name, description, price, stock, sku, category, image_url
      `, [name, description, price, stock || 0, sku, category, imageUrl]);

      return {
        statusCode: 201,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: result.rows[0] })
      };
    } catch (error) {
      console.error('Create product error:', error);
      return authError('Failed to create product', 500);
    }
  }

  return authError('Method Not Allowed', 405);
}
