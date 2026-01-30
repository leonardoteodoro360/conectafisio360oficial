// dashboard.js - Funcionalidades do Painel

document.addEventListener('DOMContentLoaded', function() {
    // Anima as barras de progresso
    const progressBars = document.querySelectorAll('.progress-fill');
    const progressTexts = document.querySelectorAll('.progress-text');
    
    progressBars.forEach((bar, index) => {
        const card = bar.closest('.course-card');
        const progress = card.getAttribute('data-progress') || 0;
        
        // Anima a barra
        setTimeout(() => {
            bar.style.width = progress + '%';
        }, index * 300);
        
        // Atualiza texto
        if (progressTexts[index]) {
            progressTexts[index].textContent = `${progress}% completo`;
        }
    });
    
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
        
        link.addEventListener('click', function(e) {
            menuLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
});
