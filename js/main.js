import Router from './router.js';

// Products Data
const products = {
    1: { id: 1, name: 'Traditional Sour Fig Jam', price: 85, emoji: '🫐' },
    2: { id: 2, name: 'Sour Fig Honey', price: 120, emoji: '🍯' },
    3: { id: 3, name: 'Sour Fig Herbal Tea', price: 65, emoji: '🍵' },
    4: { id: 4, name: 'Sour Fig Skin Salve', price: 95, emoji: '🧴' },
    5: { id: 5, name: 'Sour Fig Chutney', price: 75, emoji: '🥫' },
    6: { id: 6, name: 'Sour Fig Gift Set', price: 250, emoji: '🎁' }
};

// Cart State
let cart = JSON.parse(localStorage.getItem('brotusphere-cart')) || [];

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
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }
    saveCart();
    updateCartUI();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('brotusphere-cart', JSON.stringify(cart));
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="cart-empty">Your cart is empty</div>';
        cartTotal.textContent = 'R0';
    } else {
        let total = 0;
        cartItems.innerHTML = cart.map(item => {
            const product = products[item.id];
            total += product.price * item.quantity;
            return `
                <div class="cart-item">
                    <div class="cart-item-image">${product.emoji}</div>
                    <div class="cart-item-details">
                        <h4>${product.name}</h4>
                        <div class="price">R${product.price} x ${item.quantity}</div>
                    </div>
                    <button class="cart-item-remove" data-remove="${item.id}">Remove</button>
                </div>
            `;
        }).join('');
        cartTotal.textContent = `R${total}`;
        
        document.querySelectorAll('[data-remove]').forEach(btn => {
            btn.addEventListener('click', () => {
                removeFromCart(parseInt(btn.dataset.remove));
            });
        });
    }
}

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
    '/': { page: 'home', onMount: initAnimations },
    '/index.html': { page: 'home', onMount: initAnimations },
    '/about': { page: 'about', onMount: initAnimations },
    '/health': { page: 'health', onMount: initAnimations },
    '/products': { page: 'products', onMount: initAnimations },
    '/shop': { page: 'products', onMount: initAnimations },
    '/contact': { page: 'contact', onMount: initAnimations },
    '/science': { page: 'science' }
});

// Initialize
updateCartUI();
