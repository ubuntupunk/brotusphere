import { ENDPOINTS } from '../config.js';

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
    console.log('initProductsPage called');
    const grid = document.getElementById('products-grid');
    if (!grid) {
        console.log('grid not found');
        return;
    }
    
    // Wait for products to be loaded
    await window.productsReady;
    
    const productList = Object.values(window.appProducts || {});
    console.log('Rendering product list:', productList.length);
    
    if (productList.length === 0) {
        grid.innerHTML = '<div class="loading">No products available</div>';
        return;
    }
    
    grid.innerHTML = productList.map((product, index) => {
        const emoji = getEmoji(product.category);
        const isOutOfStock = product.stock === 0;
        const badge = index === 0 ? '<span class="shop-product-badge">Bestseller</span>' : '';
        
        return `
        <div class="shop-product fade-in visible">
            <div class="shop-product-image">
                ${badge}
                ${emoji}
            </div>
            <div class="shop-product-info">
                <h3>${product.name}</h3>
                <p class="description">${product.description || ''}</p>
                <div class="shop-product-price">R${product.price.toFixed(0)}</div>
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
    
    console.log('Grid innerHTML set, length:', grid.innerHTML.length);
    
    // Attach event listeners
    document.querySelectorAll('[data-product]').forEach(btn => {
        btn.addEventListener('click', () => {
            if (window.addToCart) {
                window.addToCart(btn.dataset.product);
            }
        });
    });
}
