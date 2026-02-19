// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar(){
  const { user, profile } = useAuth();
  const nav = useNavigate();

  async function doLogout(){
    await signOut(auth);
    nav("/login");
  }

  return (
    <header style={{display:"flex",justifyContent:"space-between",padding:"12px 24px",background:"#081023",color:"#fff"}}>
      <div>
        <Link to="/cursos" style={{color:"#38bdf8",textDecoration:"none",fontWeight:700}}>ConectaFisio360</Link>
      </div>
      <nav>
        <Link to="/cursos" style={{marginRight:12,color:"#fff"}}>Cursos</Link>
        {user ? <Link to="/dashboard" style={{marginRight:12,color:"#fff"}}>Painel</Link> : null}
        {user ? (
          <>
            <button onClick={doLogout} style={{padding:"6px 10px"}}>Sair</button>
            <span style={{marginLeft:10,opacity:0.9}}>{profile?.plano || "free"}</span>
          </>
        ) : (
          <Link to="/login" style={{marginLeft:8}}>Login</Link>
        )}
      </nav>
    </header>
  );
}
