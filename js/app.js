// ===============================
// SISTEMA GLOBAL: XP, USUÁRIO E NÍVEIS
// ===============================

let xp = localStorage.getItem("xp") ? parseInt(localStorage.getItem("xp")) : 0;
let usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado")) || { nome: "Leonardo", tipo: "premium" };

// Definição de níveis baseada no seu print
function getLevel(xp) {
    if (xp < 500) return "Iniciante";
    if (xp < 1000) return "Intermediário";
    if (xp < 1500) return "Avançado";
    return "Elite Clínico";
}

function getProgressPercent(xp) {
    let max = 2000; // Meta para o próximo nível grande
    let percent = (xp / max) * 100;
    return percent > 100 ? 100 : percent;
}

// FUNÇÃO PARA GANHAR XP (Chamada pelo botão da Arena)
function ganharXP(valor) {
    xp += valor;
    localStorage.setItem("xp", xp);
    alert("Parabéns! Você ganhou " + valor + " XP!");
    updateDashboard(); // Atualiza a tela na hora
}

function logout() {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "login.html";
}

function updateDashboard() {
    const xpText = document.getElementById("xpText");
    const progress = document.getElementById("progress");
    const levelText = document.getElementById("levelText");
    const nomeDisplay = document.getElementById("nomeUsuario");

    if (xpText) xpText.innerText = "XP: " + xp;
    if (progress) progress.style.width = getProgressPercent(xp) + "%";
    if (levelText) levelText.innerText = "Nível " + getLevel(xp);
    if (nomeDisplay && usuarioLogado) nomeDisplay.innerText = usuarioLogado.nome;
}

document.addEventListener("DOMContentLoaded", updateDashboard);
