const API_BASE = '/.netlify/functions';

export function orders() {
    return `
<div class="page" id="page-orders">
    <div class="orders-hero">
        <h1>My Orders</h1>
        <p>Track and manage your orders</p>
    </div>
    <div class="orders-content">
        <div id="ordersList" class="orders-list">
            <div class="loading">Loading orders...</div>
        </div>
    </div>
</div>
    `;
}

export async function initOrdersPage() {
    const ordersList = document.getElementById('ordersList');
    const token = localStorage.getItem('brotusphere-token');
    
    if (!token) {
        ordersList.innerHTML = '<div class="no-orders">Please <a href="#" id="loginLink">login</a> to view your orders</div>';
        document.getElementById('loginLink').addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('authBtn').click();
        });
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/orders`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch orders');
        }
        
        const data = await response.json();
        
        if (!data.orders || data.orders.length === 0) {
            ordersList.innerHTML = '<div class="no-orders">You haven\'t placed any orders yet. <a href="/products" data-link>Start shopping!</a></div>';
            return;
        }
        
        ordersList.innerHTML = data.orders.map(order => `
            <div class="order-card">
                <div class="order-header">
                    <div class="order-id">Order #${order.id.substring(0, 8)}</div>
                    <div class="order-status status-${order.status}">${order.status}</div>
                </div>
                <div class="order-details">
                    <div class="order-date">${new Date(order.created_at).toLocaleDateString()}</div>
                    <div class="order-total">R${parseFloat(order.total).toFixed(2)}</div>
                </div>
                <div class="order-items">
                    ${(order.items || []).map(item => `
                        <div class="order-item">
                            <span>${item.name}</span>
                            <span>x${item.quantity}</span>
                        </div>
                    `).join('')}
                </div>
                ${order.tracking_number ? `
                <div class="order-tracking">
                    <strong>Tracking:</strong> ${order.tracking_number} (${order.tracking_carrier})
                </div>
                ` : ''}
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading orders:', error);
        ordersList.innerHTML = '<div class="no-orders">Failed to load orders. Please try again.</div>';
    }
}
