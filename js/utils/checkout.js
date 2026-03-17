import { ENDPOINTS, STORAGE_KEYS } from '../config.js';

let paypalLoaded = false;

export function loadPayPalSDK(clientId, currency = 'ZAR') {
    if (paypalLoaded) return Promise.resolve();
    
    return new Promise((resolve, reject) => {
        if (window.paypal) {
            paypalLoaded = true;
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}&intent=capture`;
        script.setAttribute('data-namespace', 'paypal');
        script.onload = () => {
            paypalLoaded = true;
            resolve();
        };
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

export function renderPayPalButton(containerId, total, onApprove, onError) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error('PayPal container not found:', containerId);
        onError?.('Checkout container not found');
        return;
    }
    
    container.innerHTML = '';
    
    if (!window.paypal) {
        container.innerHTML = '<p style="color:red;">PayPal failed to load. Please refresh and try again.</p>';
        onError?.('PayPal not loaded');
        return;
    }
    
    window.paypal.Buttons({
        style: {
            layout: 'vertical',
            color: 'blue',
            shape: 'rect',
            label: 'paypal'
        },
        createOrder: (data, actions) => {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: total.toFixed(2),
                        currency_code: 'USD'
                    },
                    description: 'Brotusphere Order'
                }]
            });
        },
        onApprove: async (data, actions) => {
            try {
                const details = await actions.order.capture();
                onApprove?.(details);
            } catch (err) {
                console.error('PayPal capture error:', err);
                onError?.('Payment capture failed');
            }
        },
        onError: (err) => {
            console.error('PayPal error:', err);
            onError?.('Payment failed. Please try again.');
        }
    }).render(`#${containerId}`);
}

export async function createOrderOnServer(items, total, shipping, paypalOrderId, billing = {}, payerEmail = null) {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    
    const response = await fetch(ENDPOINTS.ORDERS, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ 
            items, 
            total, 
            shipping, 
            paypalOrderId,
            billing,
            payerEmail
        })
    });
    
    if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Order API error:', response.status, err);
        throw new Error(err.error || `Server error: ${response.status}`);
    }
    
    return response.json();
}

export async function checkoutWithPayPal(cart, products, total, shipping) {
    const items = cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        name: products[item.productId]?.name || 'Unknown Product',
        price: products[item.productId]?.price || 0
    }));
    
    // For now, create order without PayPal ID - we'll update after payment
    return createOrderOnServer(items, total, shipping, null);
}
