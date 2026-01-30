// assets/js/main.js - ConectaFisioApp sem módulos

console.log('🚀 ConectaFisio360 App inicializando...');

class ConectaFisioApp {
    constructor() {
        // Usa o PathManager já exposto globalmente
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
        // Carrega header se existir placeholder
        if (document.querySelector('header[data-load]')) {
            await this.paths.loadComponent('partials/header.html', 'header[data-load]');
        }
        
        // Carrega footer se não existir ou tiver data-load
        if (!document.querySelector('footer') || document.querySelector('footer[data-load]')) {
            await this.paths.loadComponent('partials/footer.html', 'footer, footer[data-load]');
        }
    }
    
    initNavigation() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('[data-nav]');
        
        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href') || '';
            // Resolve o caminho absoluto para comparação
            const resolvedLinkPath = this.paths.resolve(linkPath);
            // Remove o basePath para comparação relativa
            const relativeLinkPath = resolvedLinkPath.replace(this.paths.basePath, '');
            // Remove a barra inicial se existir
            const cleanLinkPath = relativeLinkPath.startsWith('/') ? relativeLinkPath.slice(1) : relativeLinkPath;
            const cleanCurrentPath = currentPath.replace(this.paths.basePath, '').replace(/^\//, '');
            
            // Compara os caminhos (considerando que a página atual pode ter .html ou não)
            const isActive = cleanCurrentPath === cleanLinkPath || 
                             (cleanCurrentPath === '' && cleanLinkPath === 'index.html');
            
            link.classList.toggle('active', isActive);
            
            // Prefetch pages on hover
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
                        const targetWidth = bar.dataset.progress || 
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
                if (container) {
                    bar.dataset.progress = container.dataset.progress;
                }
                progressObserver.observe(bar);
            });
        } else {
            // Fallback: anima todos após um delay
            progressBars.forEach((bar, index) => {
                const container = bar.closest('[data-progress]');
                const targetWidth = container ? container.dataset.progress : '0';
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
        // Implementação simples de toast
        console.log(`[${type.toUpperCase()}] ${message}`);
        // Pode ser expandido para mostrar um toast na UI
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Verifica se estamos no ambiente certo
    if (document.body.dataset.app !== 'conectafisio') {
        console.warn('App não inicializado: data-app attribute missing');
        return;
    }
    
    // Inicializa o app
    window.App = new ConectaFisioApp();
});
