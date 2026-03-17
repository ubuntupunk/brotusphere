export const API_BASE = '/.netlify/functions';

export const ENDPOINTS = {
    AUTH: `${API_BASE}/auth`,
    PRODUCTS: `${API_BASE}/products`,
    ORDERS: `${API_BASE}/orders`,
    PAYPAL: `${API_BASE}/paypal`,
    TRACK: `${API_BASE}/track`,
    INIT_DB: `${API_BASE}/init-db`
};

export const STORAGE_KEYS = {
    CART: 'brotusphere-cart',
    TOKEN: 'brotusphere-token',
    USER: 'brotusphere-user',
    PROFILE: 'brotusphere-profile'
};

export const TIMING = {
    DEBOUNCE_MS: 300,
    ANIMATION_DELAY_MS: 1000,
    API_TIMEOUT_MS: 10000
};

export const LIMITS = {
    MAX_CART_ITEMS: 99,
    MIN_PASSWORD_LENGTH: 6
};

export const OPENALEX_API = 'https://api.openalex.org';
export const OPENALEX_API_KEY = ''; 
export const SERPAPI_KEY = ''; 
