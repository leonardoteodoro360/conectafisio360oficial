// ativos/js/base.js - Gerenciador de Paths + Autenticação Universal
class PathManager {
    constructor() {
        this.isGitHubPages = window.location.hostname.includes('github.io');
        this.basePath = this.getBasePath();
        this.init();
    }

    getBasePath() {
        const path = window.location.pathname;

        if (this.isGitHubPages) {
            const repoName = path.split('/')[1];
            return repoName ? `/${repoName}/` : '/';
        }

        return '/';
    }

    resolve(path) {
        if (path.startsWith('http')) return path;

        const cleanPath = path.startsWith('/') ? path.slice(1) : path;
        return `${this.basePath}${cleanPath}`;
    }

    async loadComponent(componentPath, targetSelector) {
        const fullPath = this.resolve(componentPath);

        try {
            const response = await fetch(fullPath);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const html = await response.text();
            const target = document.querySelector(targetSelector);

            if (target) {
                target.innerHTML = html;
                this.executeScripts(target);
                return true;
            }
        } catch (error) {
            console.error(`Erro ao carregar ${componentPath}:`, error);
            this.fallbackComponent(targetSelector);
            return false;
        }
    }

    executeScripts(container) {
        const scripts = container.querySelectorAll('script');
        scripts.forEach(oldScript => {
            const newScript = document.createElement('script');
            Array.from(oldScript.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value);
            });
            newScript.textContent = oldScript.textContent;
            oldScript.parentNode.replaceChild(newScript, oldScript);
        });
    }

    fallbackComponent(targetSelector) {
        const target = document.querySelector(targetSelector);
        if (!target) return;

        if (targetSelector === 'footer') {
            target.innerHTML = `
                <div style="text-align:center;padding:20px;background:#1e293b;color:white;">
                    <p>© ${new Date().getFullYear()} ConectaFisio360</p>
                </div>
            `;
        }
    }

    /* =========================
       🔒 AUTENTICAÇÃO
       ========================= */

    isLoggedIn() {
        return !!localStorage.getItem('usuarioLogado');
    }

    requireAuth() {
        const publicPages = ['login.html', 'cadastro.html', 'index.html'];

        const currentPage = window.location.pathname.split('/').pop();

        if (!this.isLoggedIn() && !publicPages.includes(currentPage)) {
            window.location.href = this.resolve('login.html');
        }
    }

    logout() {
        localStorage.removeItem('usuarioLogado');
        window.location.href = this.resolve('login.html');
    }

    getUser() {
        return localStorage.getItem('usuarioLogado');
    }

    init() {
        window.PathManager = this;

        console.log('PathManager inicializado:', {
            basePath: this.basePath,
            isGitHubPages: this.isGitHubPages,
            currentPath: window.location.pathname
        });

        // Protege páginas automaticamente
        this.requireAuth();
    }
}

// Inicializa automaticamente
document.addEventListener('DOMContentLoaded', () => {
    window.paths = new PathManager();
});

