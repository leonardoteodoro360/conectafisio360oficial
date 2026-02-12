// ===============================
// SISTEMA GLOBAL DE XP
// ===============================

let xp = localStorage.getItem("xp")
  ? parseInt(localStorage.getItem("xp"))
  : 0;

// Definição de níveis
function getLevel(xp){
    if(xp < 200) return "Iniciante";
    if(xp < 500) return "Intermediário";
    if(xp < 1000) return "Avançado";
    return "Elite Clínico";
}

// Progresso percentual (base 1000 XP)
function getProgressPercent(xp){
    let max = 1000;
    return (xp / max) * 100;
}

// Adicionar XP
function addXP(value){
    xp += value;
    localStorage.setItem("xp", xp);
}

// Atualizar painel (se existir na página)
function updateDashboard(){
    const xpText = document.getElementById("xpText");
    const progress = document.getElementById("progress");
    const levelText = document.getElementById("levelText");

    if(xpText) xpText.innerText = "XP: " + xp;
    if(progress) progress.style.width = getProgressPercent(xp) + "%";
    if(levelText) levelText.innerText = "Nível " + getLevel(xp);
}

// Executa automaticamente quando página carrega
document.addEventListener("DOMContentLoaded", updateDashboard);
