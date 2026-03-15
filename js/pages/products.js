const API_BASE = '/.netlify/functions';

export async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE}/products`);
        const data = await response.json();
        return data.products || [];
    } catch (error) {
        console.error('Failed to fetch products:', error);
        return [];
    }
}

function getEmoji(category) {
    const emojis = {
        'Preserves': '🫐',
        'Honey': '🍯',
        'Tea': '🍵',
        'Skincare': '🧴',
        'Gifts': '🎁'
    };
    return emojis[category] || '📦';
}

export function products() {
    return `
<div class="page" id="page-products">
<div class="shop-hero">
    <h1>Our Products</h1>
    <p>Handcrafted with love using locally sourced sour figs</p>
</div>

<section class="shop-content">
    <div class="shop-grid" id="products-grid">
        <div class="loading">Loading products...</div>
    </div>
</section>
</div>
    `;
}

export async function initProductsPage() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    
    const productList = await loadProducts();
    
    if (productList.length === 0) {
        grid.innerHTML = '<div class="no-results">No products available</div>';
        return;
    }
    
    grid.innerHTML = productList.map((product, index) => {
        const emoji = getEmoji(product.category);
        const isOutOfStock = product.stock === 0;
        const badge = index === 0 ? '<span class="shop-product-badge">Bestseller</span>' : '';
        
        return `
        <div class="shop-product fade-in">
            <div class="shop-product-image">
                ${badge}
                ${emoji}
            </div>
            <div class="shop-product-info">
                <h3>${product.name}</h3>
                <p class="description">${product.description || ''}</p>
                <div class="shop-product-price">R${parseFloat(product.price).toFixed(0)}</div>
                ${isOutOfStock 
                    ? '<button class="shop-product-btn" disabled>Out of Stock</button>'
                    : `<button class="shop-product-btn" data-product="${product.id}">Add to Cart</button>`
                }
                ${product.stock > 0 && product.stock < 10 
                    ? `<p class="stock-warning">Only ${product.stock} left!</p>` 
                    : ''
                }
            </div>
        </div>
        `;
    }).join('');
    
    // Re-initialize event listeners for new buttons
    document.querySelectorAll('[data-product]').forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = btn.dataset.product;
            if (typeof addToCart === 'function') {
                addToCart(productId);
            } else {
                console.error('addToCart not available');
            }
        });
    });
}
