// src/pages/Login.jsx
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

export default function Login(){
  const [email,setEmail] = useState("");
  const [senha,setSenha] = useState("");
  const [err,setErr] = useState("");
  const nav = useNavigate();

  async function submit(e){
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      nav("/dashboard");
    } catch (error) {
      setErr(error.message);
    }
  }

  return (
    <div style={{maxWidth:420, margin:"40px auto", padding:24, background:"#0f172a", color:"#fff", borderRadius:12}}>
      <h2>Entrar</h2>
      <form onSubmit={submit}>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" style={{width:"100%",padding:10,marginTop:10}}/>
        <input type="password" value={senha} onChange={e=>setSenha(e.target.value)} placeholder="senha" style={{width:"100%",padding:10,marginTop:10}}/>
        <button style={{marginTop:12,padding:10}}>Entrar</button>
        <div style={{color:"tomato",marginTop:8}}>{err}</div>
      </form>
      <p style={{marginTop:8}}>Não tem conta? <Link to="/register">Cadastre-se</Link></p>
    </div>
  );
}
