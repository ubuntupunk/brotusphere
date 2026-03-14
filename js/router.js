class Router {
    constructor(routes) {
        this.routes = routes;
        this.init();
    }

    init() {
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

    handleRoute() {
        const path = window.location.pathname || '/';
        const route = this.routes[path] || this.routes['/'];
        
        if (route) {
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            const pageElement = document.getElementById(`page-${route.page}`);
            if (pageElement) {
                pageElement.classList.add('active');
                window.scrollTo(0, 0);
                if (route.onMount) route.onMount();
                this.updateActiveLinks();
            }
        }
    }

    updateActiveLinks() {
        const currentPath = window.location.pathname || '/';
        document.querySelectorAll('[data-link]').forEach(link => {
            const href = link.getAttribute('href');
            link.classList.toggle('active', href === currentPath);
        });
    }
}

export default Router;
