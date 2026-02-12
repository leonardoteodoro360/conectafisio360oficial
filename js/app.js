// ===============================
// CONECTAFISIO360 - REALTIME DATABASE (COM EXPORTS)
// ===============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getDatabase, ref, set, get, update } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBceFT9nmk1XfVbYZEcZ3yUY1pstUblD3E",
  authDomain: "conectafisio-web.firebaseapp.com",
  projectId: "conectafisio-web",
  storageBucket: "conectafisio-web.firebasestorage.app",
  messagingSenderId: "816967061116",
  appId: "1:816967061116:web:0c716703027427827fc3f9",
  measurementId: "G-VH4C6XD8ZF"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// ========== VARIÁVEIS GLOBAIS ==========
let usuarioAtual = null;
let xp = 0;
let desafios = 0;
let plano = 'normal';

// ========== OBSERVADOR DE ESTADO DO USUÁRIO ==========
onAuthStateChanged(auth, async (user) => {
  if (user) {
    usuarioAtual = user;
    localStorage.setItem('firebaseUser', JSON.stringify({ uid: user.uid, email: user.email }));

    const userRef = ref(db, `usuarios/${user.uid}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      xp = data.xp || 0;
      desafios = data.desafios || 0;
      plano = data.plano || 'normal';
    } else {
      await set(userRef, {
        email: user.email,
        nome: user.displayName || "Usuário",
        xp: 0,
        desafios: 0,
        plano: 'normal',
        criadoEm: new Date().toISOString()
      });
    }
    window.dispatchEvent(new CustomEvent('usuarioAtualizado', {
      detail: { usuario: user, xp, desafios, plano, nivel: getLevel(xp) }
    }));
  } else {
    usuarioAtual = null;
    localStorage.removeItem('firebaseUser');
    xp = 0; desafios = 0; plano = 'normal';
    window.dispatchEvent(new CustomEvent('usuarioAtualizado', {
      detail: { usuario: null, xp, desafios, plano, nivel: getLevel(xp) }
    }));
    const publicPages = ['index.html', 'login.html', 'cadastro.html'];
    const currentPage = window.location.pathname.split('/').pop();
    if (!publicPages.includes(currentPage) && currentPage !== '') {
      window.location.href = 'login.html';
    }
  }
});

// ========== FUNÇÃO DE NÍVEL ==========
export function getLevel(xp) {
  if (xp < 500) return "Iniciante";
  if (xp < 1000) return "Intermediário";
  if (xp < 1500) return "Avançado";
  return "Elite Clínico";
}
window.getLevel = getLevel;

// ========== CADASTRAR ==========
export async function cadastrar(email, senha, nome, planoSelecionado, especialidade = "Não informada") {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;
    const userRef = ref(db, `usuarios/${user.uid}`);
    const inicial = nome ? nome.charAt(0).toUpperCase() : 'U';
    await set(userRef, {
      nome,
      email,
      especialidade,
      avatar: inicial,
      xp: 0,
      desafios: 0,
      plano: planoSelecionado,
      criadoEm: new Date().toISOString(),
      bio: "Olá! Estou no ConectaFisio360 🩺"
    });
    alert("✅ Conta criada! Faça login.");
    window.location.href = "login.html";
  } catch (error) {
    alert("Erro: " + error.message);
  }
}
window.cadastrar = cadastrar;

// ========== LOGAR ==========
export async function logar(email, senha) {
  try {
    await signInWithEmailAndPassword(auth, email, senha);
  } catch (error) {
    alert("Erro: " + error.message);
  }
}
window.logar = logar;

// ========== LOGOUT ==========
export async function logout() {
  await signOut(auth);
  window.location.href = "index.html";
}
window.logout = logout;

// ========== ADICIONAR XP ==========
export async function adicionarXP(pontos) {
  if (!usuarioAtual) return;
  const userRef = ref(db, `usuarios/${usuarioAtual.uid}`);
  const snapshot = await get(userRef);
  if (snapshot.exists()) {
    const dados = snapshot.val();
    const novoXP = (dados.xp || 0) + pontos;
    const novosDesafios = (dados.desafios || 0) + 1;
    await update(userRef, { xp: novoXP, desafios: novosDesafios });
    xp = novoXP;
    desafios = novosDesafios;
  } else {
    await set(userRef, { xp: pontos, desafios: 1 });
    xp = pontos;
    desafios = 1;
  }
  window.dispatchEvent(new CustomEvent('usuarioAtualizado', {
    detail: { usuario: usuarioAtual, xp, desafios, plano, nivel: getLevel(xp) }
  }));
}
window.adicionarXP = adicionarXP;

// ========== GETTERS ==========
export function usuarioAtual() { return usuarioAtual; }
window.usuarioAtual = usuarioAtual;

export function planoUsuario() { return plano; }
window.planoUsuario = planoUsuario;

export function xpAtual() { return xp; }
window.xpAtual = xpAtual;

export function desafiosAtual() { return desafios; }
window.desafiosAtual = desafiosAtual;
