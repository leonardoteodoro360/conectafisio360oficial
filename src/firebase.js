import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { 
  getDatabase, 
  ref, 
  set, 
  get, 
  update 
} from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}; // Removida a vírgula extra e os imports duplicados que estavam aqui

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);

// Exportando as funções auxiliares
export const cadastrar = async (email, senha, nome, plano) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
  const user = userCredential.user;
  await set(ref(db, `usuarios/${user.uid}`), {
    nome, email, plano, xp: 0, desafios: 0, criadoEm: new Date().toISOString()
  });
  return user;
};

export const logar = (email, senha) => signInWithEmailAndPassword(auth, email, senha);
export const logout = () => signOut(auth);
export const buscarUsuario = async (uid) => {
  const snapshot = await get(ref(db, `usuarios/${uid}`));
  return snapshot.exists() ? snapshot.val() : null;
};
