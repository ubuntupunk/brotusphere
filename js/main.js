import Router from './router.js';

const API_BASE = '/.netlify/functions';

window.appProducts = {};
window.appCart = JSON.parse(localStorage.getItem('brotusphere-cart')) || [];

async function fetchProducts() {
    try {
        console.log('Fetching products from:', `${API_BASE}/products`);
        const response = await fetch(`${API_BASE}/products`);
        const data = await response.json();
        console.log('API response:', data);
        
        if (data.products) {
            window.appProducts = {};
            data.products.forEach(p => {
                window.appProducts[p.id] = {
                    id: p.id,
                    name: p.name,
                    price: parseFloat(p.price),
                    description: p.description,
                    stock: p.stock,
                    category: p.category,
                    image_url: p.image_url,
                    emoji: getEmoji(p.category)
                };
            });
            console.log('Products stored:', window.appProducts);
            console.log('Products count:', Object.keys(window.appProducts).length);
        }
    } catch (error) {
        console.error('Failed to fetch products:', error);
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

// Make functions globally accessible
window.getAppProducts = () => window.appProducts;
window.getAppCart = () => window.appCart;

// DOM Elements
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileOverlay = document.getElementById('mobileOverlay');
const mobileClose = document.getElementById('mobileClose');
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const cartClose = document.getElementById('cartClose');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');

// Navigation Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu
mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.add('active');
    mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
});

const closeMobileMenu = () => {
    mobileMenu.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
};

mobileClose.addEventListener('click', closeMobileMenu);
mobileOverlay.addEventListener('click', closeMobileMenu);

// Cart Modal
cartBtn.addEventListener('click', () => {
    cartModal.classList.add('active');
    mobileOverlay.classList.add('active');
});

cartClose.addEventListener('click', () => {
    cartModal.classList.remove('active');
    mobileOverlay.classList.remove('active');
});

mobileOverlay.addEventListener('click', () => {
    cartModal.classList.remove('active');
    closeMobileMenu();
});

// Cart Functions
function addToCart(productId) {
    const products = window.appProducts;
    
    if (!products[productId]) {
        console.error('Product not found:', productId);
        return;
    }
    
    const cart = window.appCart;
    const existingItem = cart.find(item => item.productId === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ productId, quantity: 1 });
    }
    window.appCart = cart;
    saveCart();
    updateCartUI();
    
    // Show feedback
    const btn = document.querySelector(`[data-product="${productId}"]`);
    if (btn) {
        btn.textContent = 'Added!';
        setTimeout(() => {
            btn.textContent = 'Add to Cart';
        }, 1000);
    }
}

function removeFromCart(productId) {
    window.appCart = window.appCart.filter(item => item.productId !== productId);
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('brotusphere-cart', JSON.stringify(window.appCart));
}

function updateCartUI() {
    const cart = window.appCart;
    const products = window.appProducts;
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="cart-empty">Your cart is empty</div>';
        cartTotal.textContent = 'R0';
    } else {
        let total = 0;
        cartItems.innerHTML = cart.map(item => {
            const product = products[item.productId];
            if (!product) return '';
            
            total += product.price * item.quantity;
            return `
                <div class="cart-item">
                    <div class="cart-item-image">${product.emoji}</div>
                    <div class="cart-item-details">
                        <h4>${product.name}</h4>
                        <div class="price">R${product.price} x ${item.quantity}</div>
                    </div>
                    <button class="cart-item-remove" data-remove="${item.productId}">Remove</button>
                </div>
            `;
        }).join('');
        
        if (cartItems.innerHTML === '') {
            cartItems.innerHTML = '<div class="cart-empty">Your cart is empty</div>';
        }
        
        cartTotal.textContent = `R${total}`;
        
        document.querySelectorAll('[data-remove]').forEach(btn => {
            btn.addEventListener('click', () => {
                removeFromCart(btn.dataset.remove);
            });
        });
    }
}

// Make addToCart globally accessible
window.addToCart = addToCart;

// Animations
function initAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => observer.observe(el));
}

// Router Configuration
const router = new Router({
    '/': { page: 'home', onMount: () => { initAnimations(); initHomePage(); } },
    '/index.html': { page: 'home', onMount: () => { initAnimations(); initHomePage(); } },
    '/about': { page: 'about', onMount: initAnimations },
    '/health': { page: 'health', onMount: initAnimations },
    '/products': { page: 'products', onMount: () => { initAnimations(); initProductsPage(); } },
    '/shop': { page: 'products', onMount: () => { initAnimations(); initProductsPage(); } },
    '/contact': { page: 'contact', onMount: initAnimations },
    '/science': { page: 'science' },
    '/sphere': { page: 'sphere', onMount: initAnimations }
});

// Initialize - wait for products before router is fully ready
async function init() {
    await fetchProducts();
    updateCartUI();
    console.log('App initialized, products ready');
}

init();
