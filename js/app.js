// ===============================
// SISTEMA CONECTAFISIO 360
// ===============================

// Carrega os dados salvos ou começa do zero
let xp = localStorage.getItem("xp") ? parseInt(localStorage.getItem("xp")) : 0;
let desafios = localStorage.getItem("desafios") ? parseInt(localStorage.getItem("desafios")) : 0;
let usuario = JSON.parse(localStorage.getItem("usuarioLogado")) || { nome: "Leonardo Teodoro", tipo: "premium" };

// Lógica de Níveis (Baseado nos seus prints)
function getLevel(xp) {
    if (xp < 500) return "Iniciante";
    if (xp < 1000) return "Intermediário";
    if (xp < 1500) return "Avançado";
    return "Elite Clínico";
}

// Função para ganhar XP e contar desafio
function concluirDesafio(valorXP) {
    xp += valorXP;
    desafios += 1; // Soma +1 desafio concluído
    localStorage.setItem("xp", xp);
    localStorage.setItem("desafios", desafios);
    alert("Incrível! + " + valorXP + " XP para sua conta!");
    window.location.href = "painel.html"; // Volta para o painel atualizado
}

// Atualiza as informações nas telas
function atualizarInterface() {
    const elementos = {
        xpText: document.getElementById("xpText"),
        progress: document.getElementById("progress"),
        levelText: document.getElementById("levelText"),
        nomeUser: document.getElementById("nomeUsuario"),
        contDesafios: document.getElementById("contDesafios")
    };

    if (elementos.xpText) elementos.xpText.innerText = "XP: " + xp;
    if (elementos.levelText) elementos.levelText.innerText = getLevel(xp);
    if (elementos.nomeUser) elementos.nomeUser.innerText = usuario.nome;
    if (elementos.contDesafios) elementos.contDesafios.innerText = desafios;
    
    if (elementos.progress) {
        let percent = (xp / 2000) * 100; // Meta de 2000 XP
        elementos.progress.style.width = (percent > 100 ? 100 : percent) + "%";
    }
}

document.addEventListener("DOMContentLoaded", atualizarInterface);

function logout() {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "login.html";
}
