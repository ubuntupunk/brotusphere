import { ENDPOINTS, STORAGE_KEYS } from '../config.js';
import { formatCurrency } from '../utils/currency.js';

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

function getTrackingUrl(carrier, number) {
    if (!carrier || !number) return null;
    
    const carriers = {
        'dhl': `https://www.dhl.com/en/express/tracking.html?AWB=${number}`,
        'fedex': `https://www.fedex.com/fedextrack/?trknbr=${number}`,
        'ups': `https://www.ups.com/track?tracknum=${number}`,
        'south-african-postal': `https://www.postoffice.co.za/track/',
        'default': null
    };

    return carriers[carrier?.toLowerCase()] || carriers.default;
}

export async function initOrdersPage() {
    const ordersList = document.getElementById('ordersList');
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    
    if (!token) {
        ordersList.innerHTML = '<div class="no-orders">Please <a href="#" id="loginLink">login</a> to view your orders</div>';
        document.getElementById('loginLink').addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('authBtn').click();
        });
        return;
    }
    
    try {
        const response = await fetch(ENDPOINTS.ORDERS, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.status === 401 || response.status === 403) {
            ordersList.innerHTML = '<div class="no-orders">Session expired. Please <a href="#" id="loginLink">login</a> again to view your orders.</div>';
            document.getElementById('loginLink').addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem(STORAGE_KEYS.TOKEN);
                localStorage.removeItem(STORAGE_KEYS.USER);
                document.getElementById('authBtn').click();
            });
            return;
        }
        
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
                    <div class="order-total">${formatCurrency(parseFloat(order.total))}</div>
                </div>
                <div class="order-items">
                    ${(order.items || []).map(item => `
                        <div class="order-item">
                            <span>${item.name}</span>
                            <span>x${item.quantity}</span>
                            <span>${formatCurrency(parseFloat(item.unit_price))}</span>
                        </div>
                    `).join('')}
                </div>
                ${order.tracking_number ? `
                <div class="order-tracking">
                    <strong>Tracking:</strong> 
                    ${order.tracking_carrier ? `${order.tracking_carrier}: ` : ''}${order.tracking_number}
                    ${getTrackingUrl(order.tracking_carrier, order.tracking_number) ? `
                        <a href="${getTrackingUrl(order.tracking_carrier, order.tracking_number)}" target="_blank" rel="noopener">Track Package</a>
                    ` : ''}
                </div>
                ` : ''}
                <div class="order-addresses">
                    <div class="order-address">
                        <strong>Shipping to:</strong>
                        <p>${order.shipping_name || 'N/A'}</p>
                        <p>${order.shipping_address || ''}</p>
                        <p>${order.shipping_city || ''} ${order.shipping_postal_code || ''}</p>
                        <p>${order.shipping_country || ''}</p>
                    </div>
                </div>
                ${order.fulfilled_at ? `
                <div class="order-fulfillment">
                    <span class="fulfilled-badge">Fulfilled: ${new Date(order.fulfilled_at).toLocaleDateString()}</span>
                    ${order.received_at ? `<span class="received-badge">Received: ${new Date(order.received_at).toLocaleDateString()}</span>` : ''}
                </div>
                ` : ''}
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading orders:', error);
        ordersList.innerHTML = '<div class="no-orders">Failed to load orders. Please try again.</div>';
    }
}
