// ===============================
// CONECTAFISIO360 - REALTIME DATABASE
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

// ========== VARIÁVEIS GLOBAIS (privadas do módulo) ==========
let _usuarioAtual = null;
let _xp = 0;
let _desafios = 0;
let _plano = 'normal';

// ========== GETTERS EXPORTADOS ==========
export function getUsuarioAtual() { return _usuarioAtual; }
export function getXp() { return _xp; }
export function getDesafios() { return _desafios; }
export function getPlano() { return _plano; }

// Também expõe no window para compatibilidade com chamadas onclick antigas
window.getUsuarioAtual = getUsuarioAtual;
window.getXp = getXp;
window.getDesafios = getDesafios;
window.getPlano = getPlano;

// ========== OBSERVADOR DE ESTADO DO USUÁRIO ==========
onAuthStateChanged(auth, async (user) => {
  if (user) {
    _usuarioAtual = user;
    localStorage.setItem('firebaseUser', JSON.stringify({ uid: user.uid, email: user.email }));

    const userRef = ref(db, `usuarios/${user.uid}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      _xp = data.xp || 0;
      _desafios = data.desafios || 0;
      _plano = data.plano || 'normal';
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
      detail: { 
        usuario: user, 
        xp: _xp, 
        desafios: _desafios, 
        plano: _plano, 
        nivel: getLevel(_xp) 
      }
    }));
  } else {
    _usuarioAtual = null;
    localStorage.removeItem('firebaseUser');
    _xp = 0; _desafios = 0; _plano = 'normal';
    window.dispatchEvent(new CustomEvent('usuarioAtualizado', {
      detail: { 
        usuario: null, 
        xp: _xp, 
        desafios: _desafios, 
        plano: _plano, 
        nivel: getLevel(_xp) 
      }
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
  if (!_usuarioAtual) return;
  const userRef = ref(db, `usuarios/${_usuarioAtual.uid}`);
  const snapshot = await get(userRef);
  if (snapshot.exists()) {
    const dados = snapshot.val();
    const novoXP = (dados.xp || 0) + pontos;
    const novosDesafios = (dados.desafios || 0) + 1;
    await update(userRef, { xp: novoXP, desafios: novosDesafios });
    _xp = novoXP;
    _desafios = novosDesafios;
  } else {
    await set(userRef, { xp: pontos, desafios: 1 });
    _xp = pontos;
    _desafios = 1;
  }
  window.dispatchEvent(new CustomEvent('usuarioAtualizado', {
    detail: { 
      usuario: _usuarioAtual, 
      xp: _xp, 
      desafios: _desafios, 
      plano: _plano, 
      nivel: getLevel(_xp) 
    }
  }));
}
window.adicionarXP = adicionarXP;
