// CONECTAFISIO360 - main.js (sem módulos ES6)

console.log('🚀 ConectaFisio360 App inicializado');

// PathManager simplificado
class PathManager {
    constructor() {
        this.basePath = window.location.origin;
    }

    resolve(relativePath) {
        return new URL(relativePath, this.basePath).pathname;
    }

    async loadComponent(url, selector) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const html = await response.text();
            const elements = document.querySelectorAll(selector);
            if (elements.length === 0) {
                // Se não existe, cria um elemento no body
                const temp = document.createElement('div');
                temp.innerHTML = html;
                document.body.appendChild(temp.firstElementChild);
            } else {
                elements.forEach(el => {
                    el.innerHTML = html;
                });
            }
            return true;
        } catch (error) {
            console.error('Erro ao carregar componente:', error);
            return false;
        }
    }
}

class ConectaFisioApp {
    constructor() {
        this.paths = new PathManager();
        this.init();
    }

    async init() {
        await this.loadComponents();
        this.initNavigation();
        this.initUI();
        this.initProgress();
        this.bindEvents();
    }

    async loadComponents() {
        // Carrega header se existir placeholder
        if (document.querySelector('header[data-load]')) {
            await this.paths.loadComponent('partials/header.html', 'header[data-load]');
        }

        // Carrega footer se não existir
        if (!document.querySelector('footer') || document.querySelector('footer[data-load]')) {
            await this.paths.loadComponent('partials/footer.html', 'footer, footer[data-load]');
        }
    }

    initNavigation() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('[data-nav]');

        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href') || '';
            // Comparação simples: se o linkPath está contido no currentPath
            const isActive = currentPath.includes(linkPath.replace('.html', ''));

            if (isActive) {
                link.classList.add('active');
            }

            // Prefetch pages on hover
            link.addEventListener('mouseenter', () => {
                this.prefetchPage(link.getAttribute('href'));
            });
        });
    }

    prefetchPage(url) {
        if (!url || url.startsWith('#')) return;

        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        link.as = 'document';
        document.head.appendChild(link);

        setTimeout(() => {
            if (link.parentNode) {
                document.head.removeChild(link);
            }
        }, 1000);
    }

    initUI() {
        // Hover effects com Intersection Observer
        const cards = document.querySelectorAll('.card, .course-card');
        if (window.IntersectionObserver) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            }, { threshold: 0.1 });

            cards.forEach(card => observer.observe(card));
        }

        // Button ripple effect
        document.addEventListener('click', (e) => {
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

        // Usa Intersection Observer para animar só quando visível
        if (window.IntersectionObserver) {
            const progressObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const bar = entry.target;
                        const card = bar.closest('.course-card');
                        const targetWidth = card ? card.getAttribute('data-progress') || '0' : '0';

                        setTimeout(() => {
                            bar.style.width = `${targetWidth}%`;
                            bar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
                        }, 300);

                        progressObserver.unobserve(bar);
                    }
                });
            }, { threshold: 0.5 });

            progressBars.forEach(bar => progressObserver.observe(bar));
        } else {
            // Fallback: anima todas as barras
            progressBars.forEach((bar, index) => {
                const card = bar.closest('.course-card');
                const targetWidth = card ? card.getAttribute('data-progress') || '0' : '0';
                setTimeout(() => {
                    bar.style.width = `${targetWidth}%`;
                    bar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
                }, index * 300);
            });
        }
    }

    bindEvents() {
        // Global error handling
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
            this.showNotification('Ocorreu um erro. Recarregue a página.', 'error');
        });

        // Offline detection
        window.addEventListener('offline', () => {
            this.showNotification('Você está offline. Algumas funcionalidades podem não estar disponíveis.', 'warning');
        });

        window.addEventListener('online', () => {
            this.showNotification('Conexão restaurada!', 'success');
        });
    }

    showNotification(message, type = 'info') {
        // Implementação simples de notificação no console
        console.log(`[${type.toUpperCase()}] ${message}`);
        // Você pode integrar com uma lib de toast futuramente
    }

    // Funções específicas do dashboard (originalmente em dashboard.js)
    initDashboard() {
        console.log('Inicializando dashboard...');
        // Anima as barras de progresso (já feita por initProgress)
        // Efeito hover nos cards
        const cards = document.querySelectorAll('.course-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });

        // Menu ativo
        const currentPage = window.location.pathname.split('/').pop();
        const menuLinks = document.querySelectorAll('.nav-link');

        menuLinks.forEach(link => {
            const linkPage = link.getAttribute('href');
            if (linkPage === currentPage ||
                (currentPage === '' && linkPage === 'dashboard.html')) {
                link.classList.add('active');
            }

            link.addEventListener('click', function (e) {
                menuLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
}

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', () => {
    // Verifica se estamos no ambiente certo (opcional)
    // if (document.body.dataset.app !== 'conectafisio') {
    //     console.warn('App não inicializado: data-app attribute missing');
    //     return;
    // }

    const app = new ConectaFisioApp();
    window.App = app;

    // Se estivermos na página do dashboard, inicializa funcionalidades extras
    if (window.location.pathname.includes('dashboard')) {
        app.initDashboard();
    }
});
