// src/pages/Register.jsx
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Register(){
  const [email,setEmail] = useState("");
  const [senha,setSenha] = useState("");
  const [nome,setNome] = useState("");
  const nav = useNavigate();

  async function submit(e){
    e.preventDefault();
    const cred = await createUserWithEmailAndPassword(auth, email, senha);
    // Cria perfil no Firestore
    await setDoc(doc(db, "users", cred.user.uid), {
      nome,
      email,
      plano: "free",
      assinaturaAtiva: false,
      criadoEm: new Date()
    });
    nav("/dashboard");
  }

  return (
    <div style={{maxWidth:420, margin:"40px auto", padding:24, background:"#0f172a", color:"#fff", borderRadius:12}}>
      <h2>Cadastro</h2>
      <form onSubmit={submit}>
        <input value={nome} onChange={e=>setNome(e.target.value)} placeholder="Nome" style={{width:"100%",padding:10,marginTop:10}}/>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" style={{width:"100%",padding:10,marginTop:10}}/>
        <input type="password" value={senha} onChange={e=>setSenha(e.target.value)} placeholder="Senha" style={{width:"100%",padding:10,marginTop:10}}/>
        <button style={{marginTop:12,padding:10}}>Criar conta</button>
      </form>
    </div>
  );
}
