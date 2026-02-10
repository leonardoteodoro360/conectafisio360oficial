// assets/js/main.js - ConectaFisioApp sem módulos

console.log('🚀 ConectaFisio360 App inicializando...');

class ConectaFisioApp {
    constructor() {
        this.paths = window.paths || new PathManager();
        this.init();
    }

    async init() {
        await this.loadComponents();
        this.initNavigation();
        this.initUI();
        this.initProgress();
        this.bindEvents();

        console.log('✅ ConectaFisio360 App inicializado');
    }

    async loadComponents() {
        if (document.querySelector('header[data-load]')) {
            await this.paths.loadComponent('partials/header.html', 'header[data-load]');
        }

        if (!document.querySelector('footer') || document.querySelector('footer[data-load]')) {
            await this.paths.loadComponent('partials/footer.html', 'footer, footer[data-load]');
        }
    }

    initNavigation() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('[data-nav]');

        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href') || '';
            const resolvedLinkPath = this.paths.resolve(linkPath);
            const relativeLinkPath = resolvedLinkPath.replace(this.paths.basePath, '');
            const cleanLinkPath = relativeLinkPath.startsWith('/') ? relativeLinkPath.slice(1) : relativeLinkPath;
            const cleanCurrentPath = currentPath.replace(this.paths.basePath, '').replace(/^\//, '');

            const isActive =
                cleanCurrentPath === cleanLinkPath ||
                (cleanCurrentPath === '' && cleanLinkPath === 'index.html');

            link.classList.toggle('active', isActive);

            link.addEventListener('mouseenter', () => {
                this.prefetchPage(linkPath);
            });
        });
    }

    prefetchPage(url) {
        if (!url || url.startsWith('#')) return;

        const fullUrl = this.paths.resolve(url);
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = fullUrl;
        link.as = 'document';
        document.head.appendChild(link);

        setTimeout(() => {
            if (link.parentNode) document.head.removeChild(link);
        }, 1000);
    }

    initUI() {
        const cards = document.querySelectorAll('.card, .course-card');

        if (window.IntersectionObserver) {
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            }, { threshold: 0.1 });

            cards.forEach(card => observer.observe(card));
        }

        document.addEventListener('click', e => {
            if (e.target.matches('.btn, .btn-comecar')) {
                this.createRipple(e);
            }
        });
    }

    createRipple(event) {
        const button = event.currentTarget;
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
        circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
        circle.classList.add('ripple');

        const ripple = button.querySelector('.ripple');
        if (ripple) ripple.remove();

        button.appendChild(circle);
    }

    initProgress() {
        const progressBars = document.querySelectorAll('.progress-fill');
        if (!progressBars.length) return;

        if (window.IntersectionObserver) {
            const progressObserver = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const bar = entry.target;
                        const targetWidth =
                            bar.dataset.progress ||
                            bar.closest('[data-progress]')?.dataset.progress ||
                            '0';

                        setTimeout(() => {
                            bar.style.width = `${targetWidth}%`;
                            bar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
                        }, 300);

                        progressObserver.unobserve(bar);
                    }
                });
            }, { threshold: 0.5 });

            progressBars.forEach(bar => {
                const container = bar.closest('[data-progress]');
                if (container) bar.dataset.progress = container.dataset.progress;
                progressObserver.observe(bar);
            });
        }
    }

    bindEvents() {
        window.addEventListener('error', e => {
            console.error('Global error:', e.error);
        });

        window.addEventListener('offline', () => {
            console.warn('Você está offline');
        });

        window.addEventListener('online', () => {
            console.log('Conexão restaurada');
        });
    }
}

// Inicialização inteligente
document.addEventListener('DOMContentLoaded', () => {
    const appName = document.body.dataset.app;

    if (appName === 'conectafisio') {
        window.App = new ConectaFisioApp();
    } else {
        console.log('ℹ Página pública: App não necessário');
    }
});
