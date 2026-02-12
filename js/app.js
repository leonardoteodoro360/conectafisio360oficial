// ===============================
// SISTEMA DE USUÁRIO E ACESSO
// ===============================

// Simula um banco de dados de usuários (Para teste)
const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado")) || null;

function verificarAcessoPremium() {
    if (!usuarioLogado || usuarioLogado.tipo !== 'premium') {
        // Se tentar acessar página premium sem ser premium, volta pro painel
        alert("Acesso restrito para membros Premium!");
        window.location.href = "painel.html";
    }
}

function logout() {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "login.html";
}
