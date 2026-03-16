import Router from './router.js';

console.log('main.js starting...');

const API_BASE = '/.netlify/functions';

window.appProducts = {};
window.appCart = JSON.parse(localStorage.getItem('brotusphere-cart')) || [];

async function fetchProducts() {
    try {
        const response = await fetch(`${API_BASE}/products`);
        const data = await response.json();
        
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
            console.log('Products loaded:', Object.keys(window.appProducts).length);
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

// Auth
const authBtn = document.getElementById('authBtn');
const authModal = document.getElementById('authModal');
const authClose = document.getElementById('authClose');
const authText = document.getElementById('authText');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const authMessage = document.getElementById('authMessage');

let currentUser = null;

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
    authModal.classList.remove('active');
    closeMobileMenu();
});

// Auth Modal
const authDropdown = document.getElementById('authDropdown');

authBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentUser) {
        // Toggle dropdown
        authDropdown.classList.toggle('active');
    } else {
        authModal.classList.add('active');
        mobileOverlay.classList.add('active');
    }
});

// Close dropdown when clicking outside
document.addEventListener('click', () => {
    authDropdown.classList.remove('active');
});

// Logout
document.getElementById('logoutLink').addEventListener('click', (e) => {
    e.preventDefault();
    currentUser = null;
    localStorage.removeItem('brotusphere-user');
    localStorage.removeItem('brotusphere-token');
    authText.textContent = 'Login';
    authDropdown.classList.remove('active');
});

// Profile link
document.getElementById('profileLink').addEventListener('click', (e) => {
    e.preventDefault();
    alert('Profile page coming soon!');
    authDropdown.classList.remove('active');
});

// Orders link
document.getElementById('ordersLink').addEventListener('click', (e) => {
    e.preventDefault();
    alert('Orders page coming soon!');
    authDropdown.classList.remove('active');
});

authClose.addEventListener('click', () => {
    authModal.classList.remove('active');
    mobileOverlay.classList.remove('active');
});

// Auth tabs
document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        if (tab.dataset.tab === 'login') {
            loginForm.classList.remove('hidden');
            registerForm.classList.add('hidden');
        } else {
            loginForm.classList.add('hidden');
            registerForm.classList.remove('hidden');
        }
        authMessage.textContent = '';
    });
});

// Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;
    
    try {
        const response = await fetch(`${API_BASE}/auth?action=login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        
        if (response.ok) {
            currentUser = data.user;
            localStorage.setItem('brotusphere-user', JSON.stringify(data.user));
            localStorage.setItem('brotusphere-token', data.token);
            authText.textContent = data.user.name;
            authModal.classList.remove('active');
            mobileOverlay.classList.remove('active');
            authMessage.textContent = '';
        } else {
            authMessage.textContent = data.error || 'Login failed';
            authMessage.className = 'auth-message error';
        }
    } catch (error) {
        authMessage.textContent = 'Connection error';
        authMessage.className = 'auth-message error';
    }
});

// Register
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = registerForm.name.value;
    const email = registerForm.email.value;
    const password = registerForm.password.value;
    
    try {
        const response = await fetch(`${API_BASE}/auth?action=signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const data = await response.json();
        
        if (response.ok) {
            currentUser = data.user;
            localStorage.setItem('brotusphere-user', JSON.stringify(data.user));
            localStorage.setItem('brotusphere-token', data.token);
            authText.textContent = data.user.name;
            authModal.classList.remove('active');
            mobileOverlay.classList.remove('active');
            authMessage.textContent = '';
        } else {
            authMessage.textContent = data.error || 'Registration failed';
            authMessage.className = 'auth-message error';
        }
    } catch (error) {
        authMessage.textContent = 'Connection error';
        authMessage.className = 'auth-message error';
    }
});

// Check for existing session
const savedUser = localStorage.getItem('brotusphere-user');
if (savedUser) {
    currentUser = JSON.parse(savedUser);
    authText.textContent = currentUser.name;
}

// Mobile auth button
document.getElementById('mobileAuthBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    closeMobileMenu();
    authModal.classList.add('active');
    mobileOverlay.classList.add('active');
});

// Checkout button handler
document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('checkout-btn')) {
        if (!currentUser) {
            authModal.classList.add('active');
            mobileOverlay.classList.add('active');
            authMessage.textContent = 'Please login to checkout';
            authMessage.className = 'auth-message error';
            return;
        }
        
        const cart = window.appCart;
        if (cart.length === 0) {
            alert('Your cart is empty');
            return;
        }
        
        // Proceed with checkout - for now just create order
        alert('Checkout functionality coming soon!');
    }
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

// Initialize app - fetch products FIRST, then create router
async function initApp() {
    console.log('initApp starting...');
    
    // Fetch products before creating router
    await fetchProducts();
    console.log('Products loaded, creating router...');
    
    // Now create router
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
    
    updateCartUI();
    console.log('App fully initialized');
}

initApp();
