import Router from './router.js';
import { initProfilePage } from './pages/profile.js';
import { initOrdersPage } from './pages/orders.js';
import { initAdminPage } from './pages/admin.js';
import { API_BASE, ENDPOINTS, STORAGE_KEYS, CURRENCY } from './config.js';
import { getEmoji } from './utils/categories.js';
import { renderPayPalButton, createOrderOnServer } from './utils/checkout.js';
import { formatCurrency, formatCurrencyWithZar } from './utils/currency.js';
import './utils/errors.js';

console.log('main.js starting...');

window.appProducts = {};
window.appCart = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART)) || [];

let productsResolve;
window.productsReady = new Promise(resolve => {
    productsResolve = resolve;
});

async function fetchProducts() {
    try {
        const response = await fetch(ENDPOINTS.PRODUCTS);
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
        productsResolve();
    } catch (error) {
        console.error('Failed to fetch products:', error);
        productsResolve();
    }
}

// Make functions globally accessible
window.getAppProducts = () => window.appProducts;
window.getAppCart = () => window.appCart;

// DOM Elements
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileOverlay = document.getElementById('mobileOverlay');
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
const mobileAuthBtn = document.getElementById('mobileAuthBtn');
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
    if (mobileMenu.classList.contains('active')) {
        closeMobileMenu();
    } else {
        mobileMenu.classList.add('active');
        mobileMenuBtn.classList.add('active');
        mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
});

const closeMobileMenu = () => {
    mobileMenu.classList.remove('active');
    mobileMenuBtn.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
};

// Touch swipe support for mobile menu
let touchStartX = 0;
let touchEndX = 0;

mobileMenu.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

mobileMenu.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    // Swipe right to close
    if (diff > swipeThreshold && mobileMenu.classList.contains('active')) {
        closeMobileMenu();
    }
    // Swipe left to open
    else if (diff < -swipeThreshold && !mobileMenu.classList.contains('active')) {
        mobileMenu.classList.add('active');
        mobileMenuBtn.classList.add('active');
        mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

mobileOverlay.addEventListener('click', closeMobileMenu);

// Cart Modal
cartBtn.addEventListener('click', () => {
    cartModal.classList.add('active');
    mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    currentFocusTrap = trapFocus(cartModal);
});

document.getElementById('mobileCartBtn')?.addEventListener('click', () => {
    closeMobileMenu();
    cartModal.classList.add('active');
    mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    currentFocusTrap = trapFocus(cartModal);
});

cartClose.addEventListener('click', () => {
    cartModal.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
    if (currentFocusTrap) {
        currentFocusTrap();
        currentFocusTrap = null;
    }
});

mobileOverlay.addEventListener('click', () => {
    cartModal.classList.remove('active');
    authModal.classList.remove('active');
    closeMobileMenu();
    document.body.style.overflow = '';
    if (currentFocusTrap) {
        currentFocusTrap();
        currentFocusTrap = null;
    }
});

// Modal utilities
function closeAllModals() {
    cartModal.classList.remove('active');
    authModal.classList.remove('active');
    closeMobileMenu();
    document.body.style.overflow = '';
    if (currentFocusTrap) {
        currentFocusTrap();
        currentFocusTrap = null;
    }
}

function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    function handleTabKey(e) {
        if (e.key !== 'Tab') return;
        
        if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable.focus();
            }
        } else {
            if (document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable.focus();
            }
        }
    }
    
    element.addEventListener('keydown', handleTabKey);
    firstFocusable?.focus();
    
    return () => element.removeEventListener('keydown', handleTabKey);
}

let currentFocusTrap = null;

// Escape key to close modals
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (cartModal.classList.contains('active') || 
            authModal.classList.contains('active') ||
            mobileMenu.classList.contains('active')) {
            e.preventDefault();
            closeAllModals();
            // Return focus to trigger element
            if (e.target) e.target.blur();
        }
    }
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
        document.body.style.overflow = 'hidden';
        currentFocusTrap = trapFocus(authModal);
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
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    authText.textContent = 'Login';
    if (mobileAuthBtn) mobileAuthBtn.textContent = 'Login / Register';
    document.getElementById('mobileAdminLink').style.display = 'none';
    authDropdown.classList.remove('active');
    document.getElementById('adminLink').style.display = 'none';
});

// Profile link
document.getElementById('profileLink').addEventListener('click', (e) => {
    e.preventDefault();
    authDropdown.classList.remove('active');
    window.router.navigate('/profile');
});

// Orders link
document.getElementById('ordersLink').addEventListener('click', (e) => {
    e.preventDefault();
    authDropdown.classList.remove('active');
    window.router.navigate('/orders');
});

// Admin link
document.getElementById('adminLink').addEventListener('click', (e) => {
    e.preventDefault();
    authDropdown.classList.remove('active');
    window.router.navigate('/admin');
});

authClose.addEventListener('click', () => {
    authModal.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
    if (currentFocusTrap) {
        currentFocusTrap();
        currentFocusTrap = null;
    }
});

// Auth tabs
document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        const forgotForm = document.getElementById('forgotPasswordForm');
        
        if (tab.dataset.tab === 'login') {
            loginForm.classList.remove('hidden');
            registerForm.classList.add('hidden');
            if (forgotForm) forgotForm.classList.add('hidden');
        } else {
            loginForm.classList.add('hidden');
            registerForm.classList.remove('hidden');
            if (forgotForm) forgotForm.classList.add('hidden');
        }
        authMessage.textContent = '';
    });
});

// Forgot password
const forgotPasswordLink = document.getElementById('forgotPasswordLink');
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
const backToLoginLink = document.getElementById('backToLoginLink');

if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.add('hidden');
        registerForm.classList.add('hidden');
        forgotPasswordForm.classList.remove('hidden');
        authMessage.textContent = '';
    });
}

if (backToLoginLink) {
    backToLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        forgotPasswordForm.classList.add('hidden');
        authMessage.textContent = '';
    });
}

if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = forgotPasswordForm.email.value;
        
        try {
            const response = await fetch(`${ENDPOINTS.AUTH}?action=forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            
            if (response.ok) {
                authMessage.textContent = 'If the email exists, a reset link will be sent.';
                authMessage.className = 'auth-message success';
            } else {
                const data = await response.json();
                authMessage.textContent = data.error || 'Failed to process request';
                authMessage.className = 'auth-message error';
            }
        } catch (error) {
            authMessage.textContent = 'Connection error';
            authMessage.className = 'auth-message error';
        }
    });
}

// Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;
    
    try {
        const response = await fetch(`${ENDPOINTS.AUTH}?action=login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        
        if (response.ok) {
            currentUser = data.user;
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
            localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
            authText.textContent = data.user.name;
            if (mobileAuthBtn) mobileAuthBtn.textContent = 'Logout';
            const mobileAdminLink = document.getElementById('mobileAdminLink');
            if (mobileAdminLink && (data.user.role === 'admin' || data.user.role === 'staff')) {
                mobileAdminLink.style.display = 'block';
            }
            authModal.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
            if (currentFocusTrap) {
                currentFocusTrap();
                currentFocusTrap = null;
            }
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
        const response = await fetch(`${ENDPOINTS.AUTH}?action=signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const data = await response.json();
        
        if (response.ok) {
            currentUser = data.user;
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
            localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
            authText.textContent = data.user.name;
            if (mobileAuthBtn) mobileAuthBtn.textContent = 'Logout';
            const mobileAdminLink = document.getElementById('mobileAdminLink');
            if (mobileAdminLink && (data.user.role === 'admin' || data.user.role === 'staff')) {
                mobileAdminLink.style.display = 'block';
            }
            authModal.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
            if (currentFocusTrap) {
                currentFocusTrap();
                currentFocusTrap = null;
            }
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
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (savedUser) {
        // Check if user matches current session
        try {
            const user = JSON.parse(savedUser);
            const currentToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
            if (!currentToken) {
                // No token - clear stale user data
                localStorage.removeItem(STORAGE_KEYS.USER);
                localStorage.removeItem(STORAGE_KEYS.CART);
                window.appCart = [];
            } else {
                currentUser = user;
                authText.textContent = currentUser.name;
                if (mobileAuthBtn) mobileAuthBtn.textContent = 'Logout';
                
                // Show/hide admin link based on role
                const adminLink = document.getElementById('adminLink');
                const mobileAdminLink = document.getElementById('mobileAdminLink');
                if (currentUser.role === 'admin' || currentUser.role === 'staff') {
                    adminLink.style.display = 'block';
                    if (mobileAdminLink) mobileAdminLink.style.display = 'block';
                } else {
                    adminLink.style.display = 'none';
                    if (mobileAdminLink) mobileAdminLink.style.display = 'none';
                }
            }
        } catch (e) {
            localStorage.removeItem(STORAGE_KEYS.USER);
            localStorage.removeItem(STORAGE_KEYS.CART);
            window.appCart = [];
        }
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
        
        // Calculate total
        let total = 0;
        const products = window.appProducts;
        cart.forEach(item => {
            const product = products[item.productId];
            if (product) {
                total += product.price * item.quantity;
            }
        });
        
        if (total === 0) {
            alert('Invalid cart - no valid products');
            return;
        }
        
        // Show PayPal checkout
        e.target.disabled = true;
        e.target.textContent = 'Processing...';
        
        const paypalContainer = document.createElement('div');
        paypalContainer.id = 'paypal-checkout-container';
        paypalContainer.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:10001;display:flex;justify-content:center;align-items:center;';
        
        // Calculate total and USD equivalent
        const usdTotal = total;
        
        const checkoutBox = document.createElement('div');
        checkoutBox.style.cssText = 'background:#fff;padding:30px;border-radius:12px;max-width:500px;width:90%;position:relative;';
        checkoutBox.innerHTML = `
            <button id="close-paypal" style="position:absolute;top:10px;right:15px;font-size:24px;background:none;border:none;cursor:pointer;">&times;</button>
            <h2 style="margin-bottom:20px;">Complete Your Order</h2>
            <p style="margin-bottom:5px;">Total: <strong>$${usdTotal.toFixed(2)} USD</strong></p>
            <p style="margin-bottom:20px;font-size:12px;color:#666;">(${formatCurrencyWithZar(total)})</p>
            <div id="paypal-button-container"></div>
        `;
        
        paypalContainer.appendChild(checkoutBox);
        document.body.appendChild(paypalContainer);
        
        document.getElementById('close-paypal').onclick = () => {
            document.body.removeChild(paypalContainer);
            e.target.disabled = false;
            e.target.textContent = 'Checkout';
        };
        
        const shipping = {
            name: currentUser.name,
            address: '',
            city: '',
            postalCode: '',
            country: 'South Africa'
        };
        
        renderPayPalButton('paypal-button-container', usdTotal, async (details) => {
            // Extract billing and shipping addresses from PayPal
            const payer = details.payer || {};
            const billingAddress = payer.address || {};
            const shippingAddress = details.purchase_units?.[0]?.shipping?.address || {};
            
            const fullShipping = {
                name: details.purchase_units?.[0]?.shipping?.name?.full_name || currentUser.name,
                address: shippingAddress.address_line_1 || '',
                address2: shippingAddress.address_line_2 || '',
                city: shippingAddress.admin_area_2 || '',
                postalCode: shippingAddress.postal_code || '',
                country: shippingAddress.country_code || 'ZA'
            };
            
            const billing = {
                name: payer.name?.full_name || currentUser.name,
                address: billingAddress.address_line_1 || '',
                address2: billingAddress.address_line_2 || '',
                city: billingAddress.admin_area_2 || '',
                postalCode: billingAddress.postal_code || '',
                country: billingAddress.country_code || 'ZA'
            };
            
            const payerEmail = payer.email_address;
            
            // Payment successful - create order on server
            try {
                await createOrderOnServer(cart, total, fullShipping, details.id, billing, payerEmail);
                
                // Clear cart and show success
                window.appCart = [];
                saveCart();
                updateCartUI();
                
                // Close cart modal if open
                const cartModal = document.getElementById('cartModal');
                if (cartModal) {
                    cartModal.classList.remove('active');
                }
                
                // Ensure body is scrollable
                document.body.style.overflow = '';
                
                document.body.removeChild(paypalContainer);
                window.errorHandler.showSuccess('Order placed successfully! Thank you for your purchase!');
                
                // Redirect to orders
                window.router.navigate('/orders');
            } catch (err) {
                console.error('Order creation error:', err);
                alert('Order creation failed: ' + err.message);
            }
            
            e.target.disabled = false;
            e.target.textContent = 'Checkout';
        }, (err) => {
            alert(err);
            document.body.removeChild(paypalContainer);
            e.target.disabled = false;
            e.target.textContent = 'Checkout';
        });
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
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(window.appCart));
}

function updateCartUI() {
    const cart = window.appCart;
    const products = window.appProducts;
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    const cartCountMobile = document.getElementById('cartCountMobile');
    if (cartCountMobile) cartCountMobile.textContent = totalItems;
    const cartCountMobileDrawer = document.getElementById('cartCountMobileDrawer');
    if (cartCountMobileDrawer) cartCountMobileDrawer.textContent = totalItems;

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
                        <div class="price">${formatCurrency(product.price * item.quantity)}</div>
                    </div>
                    <button class="cart-item-remove" data-remove="${item.productId}">Remove</button>
                </div>
            `;
        }).join('');
        
        if (cartItems.innerHTML === '') {
            cartItems.innerHTML = '<div class="cart-empty">Your cart is empty</div>';
        }
        
        cartTotal.textContent = formatCurrency(total);
        
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
    
    // Initialize error handler
    window.errorHandler.init();
    
    // Now create router
    window.router = new Router({
        '/': { page: 'home', onMount: () => { initAnimations(); initHomePage(); } },
        '/index.html': { page: 'home', onMount: () => { initAnimations(); initHomePage(); } },
        '/about': { page: 'about', onMount: initAnimations },
        '/health': { page: 'health', onMount: initAnimations },
        '/products': { page: 'products', onMount: () => { initAnimations(); initProductsPage(); } },
        '/shop': { page: 'products', onMount: () => { initAnimations(); initProductsPage(); } },
        '/contact': { page: 'contact', onMount: initAnimations },
        '/science': { page: 'science' },
        '/sphere': { page: 'sphere', onMount: initAnimations },
        '/profile': { page: 'profile', onMount: initProfilePage },
        '/orders': { page: 'orders', onMount: initOrdersPage },
        '/admin': { page: 'admin', onMount: initAdminPage }
    });
    
    updateCartUI();
    console.log('App fully initialized');
}

initApp();
