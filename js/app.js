// ===============================
// SISTEMA GLOBAL: XP E USUÁRIO
// ===============================

// Busca XP e Usuário do navegador
let xp = localStorage.getItem("xp") ? parseInt(localStorage.getItem("xp")) : 0;
let usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado")) || null;

// Definição de níveis
function getLevel(xp) {
    if (xp < 200) return "Iniciante";
    if (xp < 500) return "Intermediário";
    if (xp < 1000) return "Avançado";
    return "Elite Clínico";
}

// Progresso para a barra (base 1000 XP)
function getProgressPercent(xp) {
    let max = 1000;
    let percent = (xp / max) * 100;
    return percent > 100 ? 100 : percent;
}

// Função para deslogar
function logout() {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "login.html";
}

// Atualizar a tela automaticamente
function updateDashboard() {
    const xpText = document.getElementById("xpText");
    const progress = document.getElementById("progress");
    const levelText = document.getElementById("levelText");
    const nomeDisplay = document.getElementById("nomeUsuario");
    const areaPremium = document.getElementById("areaPremium");

    // Preenche os dados de XP
    if (xpText) xpText.innerText = "XP: " + xp;
    if (progress) progress.style.width = getProgressPercent(xp) + "%";
    if (levelText) levelText.innerText = "Nível " + getLevel(xp);

    // Verifica se tem alguém logado
    if (usuarioLogado) {
        if (nomeDisplay) nomeDisplay.innerText = usuarioLogado.nome;
        
        // MOSTRA OU ESCONDE O PREMIUM
        if (areaPremium) {
            if (usuarioLogado.tipo === "premium") {
                areaPremium.style.display = "block";
            } else {
                areaPremium.style.display = "none";
            }
        }
    }
}

// Executa quando a página abre
document.addEventListener("DOMContentLoaded", updateDashboard);
