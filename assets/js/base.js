// assets/js/base.js - Gerenciador de Paths Universal
class PathManager {
    constructor() {
        this.basePath = this.getBasePath();
        this.isGitHubPages = window.location.hostname.includes('github.io');
        this.init();
    }
    
    getBasePath() {
        // Detecta ambiente
        const path = window.location.pathname;
        
        if (this.isGitHubPages) {
            // GitHub Pages: /reponame/
            const repoName = path.split('/')[1];
            return repoName ? `/${repoName}/` : '/';
        }
        
        // Local ou outros hosts
        return '/';
    }
    
    resolve(path) {
        // Resolve paths relativos para absolutos
        if (path.startsWith('http')) return path;
        
        // Remove leading slash se já tiver no basePath
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
                // Re-processa scripts dentro do componente
                this.executeScripts(target);
                return true;
            }
        } catch (error) {
            console.error(`Failed to load ${componentPath}:`, error);
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
    
    init() {
        // Expõe globalmente
        window.PathManager = this;
        console.log('PathManager initialized:', {
            basePath: this.basePath,
            isGitHubPages: this.isGitHubPages,
            currentPath: window.location.pathname
        });
    }
}

// Inicializa automaticamente
document.addEventListener('DOMContentLoaded', () => {
    window.paths = new PathManager();
});
