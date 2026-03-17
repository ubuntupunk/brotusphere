import { ENDPOINTS, STORAGE_KEYS } from '../config.js';
import { formatCurrency } from '../utils/currency.js';

export function admin() {
    return `
<div class="page" id="page-admin">
    <div class="admin-hero">
        <h1>Admin Dashboard</h1>
    </div>
    <div class="admin-content">
        <div class="admin-tabs">
            <button class="admin-tab active" data-tab="orders">Orders</button>
            <button class="admin-tab" data-tab="products">Products</button>
            <button class="admin-tab" data-tab="users">Users</button>
        </div>
        
        <div id="adminPanel" class="admin-panel">
            <div class="loading">Loading...</div>
        </div>
    </div>
</div>
    `;
}

export async function initAdminPage() {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || '{}');
    
    if (!token) {
        document.getElementById('adminPanel').innerHTML = 
            '<div class="error">Please login to access admin</div>';
        return;
    }

    // Tab switching
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.addEventListener('click', async () => {
            document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            await loadTab(tab.dataset.tab);
        });
    });

    // Load orders by default
    await loadTab('orders');
}

async function loadTab(tab) {
    const panel = document.getElementById('adminPanel');
    panel.innerHTML = '<div class="loading">Loading...</div>';
    
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    
    try {
        const response = await fetch(`${ENDPOINTS.ADMIN}?action=${tab}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to load');
        }
        
        if (tab === 'orders') {
            renderOrders(panel, data.orders);
        } else if (tab === 'products') {
            renderProducts(panel, data.products);
        } else if (tab === 'users') {
            renderUsers(panel, data.users);
        }
    } catch (error) {
        panel.innerHTML = `<div class="error">${error.message}</div>`;
    }
}

function renderOrders(panel, orders) {
    if (!orders || orders.length === 0) {
        panel.innerHTML = '<div class="empty">No orders yet</div>';
        return;
    }
    
    panel.innerHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Tracking</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${orders.map(order => `
                    <tr data-order-id="${order.id}">
                        <td>${order.id.substring(0, 8)}</td>
                        <td>
                            <div>${order.customer_name || 'N/A'}</div>
                            <small>${order.customer_email || ''}</small>
                        </td>
                        <td>${formatCurrency(parseFloat(order.total))}</td>
                        <td>
                            <select class="status-select" data-order-id="${order.id}">
                                <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                                <option value="paid" ${order.status === 'paid' ? 'selected' : ''}>Paid</option>
                                <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                                <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                                <option value="refunded" ${order.status === 'refunded' ? 'selected' : ''}>Refunded</option>
                            </select>
                        </td>
                        <td>
                            <input type="text" class="tracking-input" 
                                   placeholder="Tracking #" 
                                   value="${order.tracking_number || ''}"
                                   data-order-id="${order.id}">
                            <select class="carrier-select" data-order-id="${order.id}">
                                <option value="">Carrier</option>
                                <option value="dhl" ${order.tracking_carrier === 'dhl' ? 'selected' : ''}>DHL</option>
                                <option value="fedex" ${order.tracking_carrier === 'fedex' ? 'selected' : ''}>FedEx</option>
                                <option value="ups" ${order.tracking_carrier === 'ups' ? 'selected' : ''}>UPS</option>
                                <option value="south-african-postal" ${order.tracking_carrier === 'south-african-postal' ? 'selected' : ''}>SA Post</option>
                            </select>
                        </td>
                        <td>${new Date(order.created_at).toLocaleDateString()}</td>
                        <td>
                            <button class="btn-small save-order-btn" data-order-id="${order.id}">Save</button>
                        </td>
                    </tr>
                    <tr class="order-details-row" data-order-id="${order.id}">
                        <td colspan="7">
                            <div class="order-details-grid">
                                <div class="order-section">
                                    <h4>Shipping</h4>
                                    <p>${order.shipping_name || 'N/A'}</p>
                                    <p>${order.shipping_address || ''}</p>
                                    <p>${order.shipping_address2 || ''}</p>
                                    <p>${order.shipping_city || ''} ${order.shipping_postal_code || ''}</p>
                                    <p>${order.shipping_country || ''}</p>
                                </div>
                                <div class="order-section">
                                    <h4>Billing</h4>
                                    <p>${order.billing_name || 'N/A'}</p>
                                    <p>${order.billing_address || ''}</p>
                                    <p>${order.billing_address2 || ''}</p>
                                    <p>${order.billing_city || ''} ${order.billing_postal_code || ''}</p>
                                    <p>${order.billing_country || ''}</p>
                                </div>
                                <div class="order-section">
                                    <h4>Items</h4>
                                    ${order.items && order.items.length > 0 ? `
                                        <ul class="order-items-list">
                                            ${order.items.map(item => `
                                                <li>
                                                    ${item.image_url ? `<img src="${item.image_url}" class="admin-item-thumb" alt="">` : ''}
                                                    <strong>${item.name}</strong> x${item.quantity} @ ${formatCurrency(parseFloat(item.unit_price))}
                                                </li>
                                            `).join('')}
                                        </ul>
                                    ` : '<p>No items</p>'}
                                </div>
                                <div class="order-section">
                                    <h4>Payment</h4>
                                    <p><small>PayPal Order:</small> ${order.paypal_order_id || 'N/A'}</p>
                                    <p><small>Transaction:</small> ${order.paypal_transaction_id || 'N/A'}</p>
                                </div>
                                <div class="order-section">
                                    <h4>Status Timeline</h4>
                                    <p><small>Created:</small> ${new Date(order.created_at).toLocaleString()}</p>
                                    <p><small>Fulfilled:</small> ${order.fulfilled_at ? new Date(order.fulfilled_at).toLocaleString() : 'Not yet'}</p>
                                    <p><small>Received:</small> ${order.received_at ? new Date(order.received_at).toLocaleString() : 'Not yet'}</p>
                                </div>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    // Add save handlers
    panel.querySelectorAll('.save-order-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const orderId = btn.dataset.orderId;
            const row = panel.querySelector(`tr[data-order-id="${orderId}"]`);
            const status = row.querySelector('.status-select').value;
            const trackingNumber = row.querySelector('.tracking-input').value;
            const trackingCarrier = row.querySelector('.carrier-select').value;
            
            await updateOrder(orderId, { status, trackingNumber, trackingCarrier });
        });
    });
}

async function updateOrder(orderId, data) {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    
    try {
        const response = await fetch(`${ENDPOINTS.ADMIN}?action=update-order`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ orderId, ...data })
        });
        
        if (!response.ok) throw new Error('Failed to update');
        
        window.errorHandler.showSuccess('Order updated');
    } catch (error) {
        window.errorHandler.showError(error.message);
    }
}

function renderProducts(panel, products) {
    if (!products || products.length === 0) {
        panel.innerHTML = '<div class="empty">No products yet</div>';
        return;
    }
    
    panel.innerHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Sold</th>
                    <th>Active</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${products.map(p => `
                    <tr data-product-id="${p.id}">
                        <td>
                            ${p.image_url ? `<img src="${p.image_url}" class="product-thumb-admin" alt="">` : ''}
                            <input type="text" class="image-url-input" 
                                   placeholder="Image URL"
                                   value="${p.image_url || ''}" 
                                   data-product-id="${p.id}">
                        </td>
                        <td>${p.name}</td>
                        <td>
                            <input type="number" class="price-input" 
                                   value="${p.price}" step="0.01" 
                                   data-product-id="${p.id}">
                        </td>
                        <td>
                            <input type="number" class="stock-input" 
                                   value="${p.stock}" 
                                   data-product-id="${p.id}">
                        </td>
                        <td>${p.total_sold || 0}</td>
                        <td>
                            <input type="checkbox" class="active-check" 
                                   ${p.is_active ? 'checked' : ''}
                                   data-product-id="${p.id}">
                        </td>
                        <td>
                            <button class="btn-small save-product-btn" data-product-id="${p.id}">Save</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    panel.querySelectorAll('.save-product-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const productId = btn.dataset.productId;
            const row = panel.querySelector(`tr[data-product-id="${productId}"]`);
            
            await updateProduct(productId, {
                price: parseFloat(row.querySelector('.price-input').value),
                stock: parseInt(row.querySelector('.stock-input').value),
                isActive: row.querySelector('.active-check').checked,
                imageUrl: row.querySelector('.image-url-input').value
            });
        });
    });
}

async function updateProduct(productId, data) {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    
    try {
        const response = await fetch(`${ENDPOINTS.ADMIN}?action=update-product`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId, ...data })
        });
        
        if (!response.ok) throw new Error('Failed to update');
        
        window.errorHandler.showSuccess('Product updated');
    } catch (error) {
        window.errorHandler.showError(error.message);
    }
}

function renderUsers(panel, users) {
    if (!users || users.length === 0) {
        panel.innerHTML = '<div class="empty">No users yet</div>';
        return;
    }
    
    panel.innerHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Orders</th>
                    <th>Joined</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${users.map(u => `
                    <tr data-user-id="${u.id}">
                        <td>${u.name || 'N/A'}</td>
                        <td>${u.email || 'N/A'}</td>
                        <td>${u.phone || ''}</td>
                        <td>
                            <select class="role-select" data-user-id="${u.id}">
                                <option value="customer" ${u.role === 'customer' ? 'selected' : ''}>Customer</option>
                                <option value="staff" ${u.role === 'staff' ? 'selected' : ''}>Staff</option>
                                <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Admin</option>
                            </select>
                        </td>
                        <td>${u.order_count || 0}</td>
                        <td>${new Date(u.created_at).toLocaleDateString()}</td>
                        <td>
                            <button class="btn-small save-user-btn" data-user-id="${u.id}">Save</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    panel.querySelectorAll('.save-user-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const userId = btn.dataset.userId;
            const row = panel.querySelector(`tr[data-user-id="${userId}"]`);
            const role = row.querySelector('.role-select').value;
            
            await updateUser(userId, { role });
        });
    });
}

async function updateUser(userId, data) {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    
    try {
        const response = await fetch(`${ENDPOINTS.ADMIN}?action=update-user`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, ...data })
        });
        
        if (!response.ok) throw new Error('Failed to update');
        
        window.errorHandler.showSuccess('User updated');
    } catch (error) {
        window.errorHandler.showError(error.message);
    }
}
