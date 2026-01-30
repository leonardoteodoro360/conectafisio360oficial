// assets/js/main.js - JavaScript principal do ConectaFisio360

console.log('🐟 ConectaFisio360 carregado com sucesso!');

// ============================================
// 1. CONFIGURAÇÕES GERAIS
// ============================================
const config = {
    siteName: 'ConectaFisio360',
    version: '1.0.0',
    developer: 'Leonardo Teodoro'
};

// ============================================
// 2. MENU E NAVEGAÇÃO
// ============================================
function initNavigation() {
    console.log('Inicializando navegação...');
    
    // Marca menu ativo baseado na URL
    const currentPage = window.location.pathname.split('/').pop();
    console.log('Página atual:', currentPage);
    
    const menuItems = document.querySelectorAll('.nav-link, .menu-item');
    
    menuItems.forEach(item => {
        const href = item.getAttribute('href');
        
        // Remove classe active de todos
        item.classList.remove('active');
        
        // Verifica se é a página atual
        if (href === currentPage || 
            (currentPage === '' && href === 'dashboard.html') ||
            (currentPage === 'index.html' && href === '../index.html')) {
            
            item.classList.add('active');
            console.log('Menu ativo definido:', item.textContent.trim());
        }
    });
}

// ============================================
// 3. ANIMAÇÕES E EFEITOS VISUAIS
// ============================================
function initAnimations() {
    // Efeito hover em cards
    const cards = document.querySelectorAll('.course-card, .card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
            card.style.transition = 'transform 0.3s ease';
            card.style.boxShadow = '0 15px 35px rgba(0,0,0,0.1)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '';
        });
    });
    
    // Efeito em botões
    const buttons = document.querySelectorAll('.btn, .btn-comecar');
    
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'scale(1.05)';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'scale(1)';
        });
    });
}

// ============================================
// 4. SISTEMA DE PROGRESSO (Dashboard)
// ============================================
function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    if (progressBars.length === 0) return;
    
    console.log('Inicializando barras de progresso...');
    
    progressBars.forEach((bar, index) => {
        const card = bar.closest('[data-progress]');
        const progress = card ? parseInt(card.getAttribute('data-progress')) || 0 : 0;
        
        // Anima após delay
        setTimeout(() => {
            bar.style.width = `${progress}%`;
            bar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
            
            // Atualiza texto se existir
            const textElement = bar.parentElement.nextElementSibling;
            if (textElement && textElement.classList.contains('progress-text')) {
                textElement.textContent = `${progress}% completo`;
            }
        }, index * 300);
    });
}

// ============================================
// 5. NOTIFICAÇÕES E ALERTAS
// ============================================
function showToast(message, type = 'info') {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    
    const toast = document.createElement('div');
    toast.className = 'conectafisio-toast';
    toast.innerHTML = `
        <div class="toast-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</div>
        <div class="toast-message">${message}</div>
        <button class="toast-close">&times;</button>
    `;
    
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        color: #1e293b;
        padding: 15px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 99999;
        border-left: 4px solid ${colors[type]};
        animation: toastSlideIn 0.3s ease;
        max-width: 400px;
        font-family: 'Nunito', sans-serif;
    `;
    
    // Estilo para animação
    const style = document.createElement('style');
    style.textContent = `
        @keyframes toastSlideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes toastSlideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(toast);
    
    // Botão de fechar
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        toast.style.animation = 'toastSlideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    });
    
    // Fecha automaticamente após 5 segundos
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'toastSlideOut 0.3s ease';
            setTimeout(() => {
                if (toast.parentNode) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }
    }, 5000);
}

// ============================================
// 6. CARREGAMENTO DE COMPONENTES
// ============================================
function loadComponent(componentPath, targetSelector) {
    fetch(componentPath)
        .then(response => {
            if (!response.ok) throw new Error('Componente não encontrado');
            return response.text();
        })
        .then(html => {
            const target = document.querySelector(targetSelector);
            if (target) {
                target.innerHTML = html;
                console.log(`Componente carregado: ${componentPath}`);
            }
        })
        .catch(error => {
            console.warn(`Não foi possível carregar ${componentPath}:`, error);
        });
}

// ============================================
// 7. INICIALIZAÇÃO PRINCIPAL
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log(`Bem-vindo ao ${config.siteName} v${config.version}`);
    console.log(`Desenvolvido por: ${config.developer}`);
    
    // Inicializa todas as funcionalidades
    initNavigation();
    initAnimations();
    initProgressBars();
    
    // Exemplo: Carregar header e footer automaticamente
    // Descomente se quiser usar:
    // loadComponent('../partials/header.html', 'header');
    // loadComponent('../partials/footer.html', 'footer');
    
    // Mostra toast de boas-vindas (opcional)
    // setTimeout(() => {
    //     showToast('Bem-vindo ao ConectaFisio360! 🐟', 'success');
    // }, 1000);
});

// ============================================
// 8. FUNÇÕES DISPONÍVEIS GLOBALMENTE
// ============================================
// Estas funções podem ser usadas de qualquer lugar
window.ConectaFisio = {
    showToast,
    config,
    loadComponent,
    
    // Função para simular progresso do curso
    updateCourseProgress: function(courseId, newProgress) {
        const courseElement = document.querySelector(`[data-course="${courseId}"]`);
        if (courseElement) {
            const progressBar = courseElement.querySelector('.progress-fill');
            if (progressBar) {
                progressBar.style.width = `${newProgress}%`;
                console.log(`Progresso do curso ${courseId} atualizado para ${newProgress}%`);
            }
        }
    },
    
    // Função para alternar tema claro/escuro
    toggleTheme: function() {
        const body = document.body;
        const isDark = body.classList.toggle('dark-theme');
        localStorage.setItem('conectafisio-theme', isDark ? 'dark' : 'light');
        showToast(`Tema ${isDark ? 'escuro' : 'claro'} ativado`, 'info');
    }
};

// Verifica tema salvo
if (localStorage.getItem('conectafisio-theme') === 'dark') {
    document.body.classList.add('dark-theme');
}
