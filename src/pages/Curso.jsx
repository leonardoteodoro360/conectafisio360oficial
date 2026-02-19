// src/pages/Curso.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

export default function Curso(){
  const { id } = useParams();
  const [curso, setCurso] = useState(null);
  const { profile } = useAuth();

  useEffect(()=>{
    async function load(){
      const snap = await getDoc(doc(db, "cursos", id));
      if(snap.exists()) setCurso(snap.data());
    }
    load();
  },[id]);

  if(!curso) return <div style={{padding:24}}>Carregando...</div>;

  const premium = curso.tipo === "premium";
  const canWatch = !premium || (profile && profile.plano === "premium");

  return (
    <div style={{padding:24}}>
      <Link to="/cursos">← Voltar</Link>
      <h1 style={{color:"#38bdf8"}}>{curso.titulo}</h1>
      <p>{curso.descricao}</p>

      {canWatch ? (
        <div style={{marginTop:20}}>
          {/* Supondo que link é URL embutível (YouTube embed) */}
          <iframe title={curso.titulo} src={curso.link} style={{width:"100%",height:520,border:0,borderRadius:8}} allowFullScreen />
        </div>
      ) : (
        <div style={{marginTop:20,padding:16,background:"#111827",borderRadius:8}}>
          🔒 Este conteúdo é Premium. <Link to="/dashboard">Faça upgrade</Link> para liberar.
        </div>
      )}
    </div>
  );
}
