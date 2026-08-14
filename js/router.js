const Router = {
  routes: {},
  currentRoute: null,
  container: null,
  
  init(container, routes) {
    this.container = container;
    this.routes = routes;
    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
  },
  
  handleRoute() {
    const hash = window.location.hash.slice(1) || 'home';
    this.currentRoute = hash;
    const renderFn = this.routes[hash];
    if (renderFn) {
      // Add page transition
      this.container.style.opacity = '0';
      this.container.style.transform = 'translateY(8px)';
      setTimeout(() => {
        renderFn(this.container);
        this.container.style.opacity = '1';
        this.container.style.transform = 'translateY(0)';
        // Update active nav
        document.querySelectorAll('.sidebar__nav-item').forEach(item => {
          item.classList.toggle('sidebar__nav-item--active', item.dataset.route === hash);
        });
      }, 150);
    }
  },
  
  navigate(hash) {
    window.location.hash = hash;
  },
  
  getCurrentRoute() {
    return this.currentRoute;
  }
};

export default Router;
