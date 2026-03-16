import { home, initHomePage } from './pages/home.js';
import { about } from './pages/about.js';
import { health } from './pages/health.js';
import { products, initProductsPage } from './pages/products.js';
import { contact } from './pages/contact.js';
import { science, initSciencePage } from './pages/science.js';
import { sphere, initSphereCarousel } from './pages/sphere.js';
import { profile, initProfilePage } from './pages/profile.js';
import { orders, initOrdersPage } from './pages/orders.js';
import { notFound } from './pages/notFound.js';

const pages = {
    home,
    about,
    health,
    products,
    contact,
    science,
    sphere,
    profile,
    orders,
    notFound
};

const pageMounts = {
    home: initHomePage,
    science: initSciencePage,
    sphere: initSphereCarousel,
    products: initProductsPage,
    profile: initProfilePage,
    orders: initOrdersPage
};

const pageTitles = {
    home: 'Brotusphere - Celebrating the Sour Fig',
    about: 'About - Brotusphere',
    health: 'Health Benefits - Brotusphere',
    products: 'Shop - Brotusphere',
    contact: 'Contact - Brotusphere',
    science: 'Scientific Research - Brotusphere',
    sphere: 'Articles & Library - Brotusphere',
    profile: 'My Profile - Brotusphere',
    orders: 'My Orders - Brotusphere',
    notFound: 'Page Not Found - Brotusphere'
};

class Router {
    constructor(routes) {
        this.routes = routes;
        this.pageContainer = document.getElementById('app');
        console.log('Router created, calling init...');
        this.init();
    }

    init() {
        console.log('Router init, container:', this.pageContainer);
        window.addEventListener('popstate', () => this.handleRoute());
        document.addEventListener('click', (e) => this.handleClick(e));
        this.handleRoute();
    }

    handleClick(e) {
        const link = e.target.closest('[data-link]');
        if (link) {
            e.preventDefault();
            const href = link.getAttribute('href');
            if (href && !href.startsWith('http')) {
                this.navigate(href);
            }
        }
    }

    navigate(path) {
        history.pushState(null, null, path);
        this.handleRoute();
    }

    async handleRoute() {
        const path = window.location.pathname || '/';
        console.log('handleRoute path:', path);
        const route = this.routes[path];
        console.log('handleRoute route:', route);
        
        if (route) {
            console.log('Rendering page:', route.page);
            const pageFn = pages[route.page];
            if (pageFn && typeof pageFn === 'function') {
                this.pageContainer.innerHTML = pageFn();
                console.log('Page rendered, container:', this.pageContainer.innerHTML.substring(0, 200));
                const pageElement = this.pageContainer.querySelector('.page');
                if (pageElement) {
                    pageElement.classList.add('active');
                }
                window.scrollTo(0, 0);
                this.updateNavStyle(route.page);
                document.title = pageTitles[route.page] || 'Brotusphere';
                if (pageMounts[route.page]) {
                    await pageMounts[route.page]();
                } else if (route.onMount) {
                    route.onMount();
                }
                this.updateActiveLinks();
                this.reinitializeEventListeners();
            } else {
                console.error('Page function not found for:', route.page);
            }
        } else {
            this.pageContainer.innerHTML = pages.notFound();
            const pageElement = this.pageContainer.querySelector('.page');
            if (pageElement) {
                pageElement.classList.add('active');
            }
            window.scrollTo(0, 0);
            this.updateNavStyle('notFound');
            document.title = pageTitles.notFound;
            this.updateActiveLinks();
        }
    }

    reinitializeEventListeners() {
        document.querySelectorAll('[data-product]').forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = parseInt(btn.dataset.product);
                if (typeof addToCart === 'function') {
                    addToCart(productId);
                }
            });
        });

        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Thank you for your message! We\'ll get back to you soon.');
                e.target.reset();
            });
        }
    }

    updateActiveLinks() {
        const currentPath = window.location.pathname || '/';
        document.querySelectorAll('[data-link]').forEach(link => {
            const href = link.getAttribute('href');
            link.classList.toggle('active', href === currentPath);
        });
    }

    updateNavStyle(page) {
        const navbar = document.getElementById('navbar');
        const darkHeroPages = ['health', 'science', 'contact', 'profile', 'orders'];
        if (darkHeroPages.includes(page)) {
            navbar.classList.add('dark-hero');
        } else {
            navbar.classList.remove('dark-hero');
        }
    }
}

export default Router;
