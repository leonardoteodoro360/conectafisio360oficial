// src/pages/Cursos.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

export default function Cursos(){
  const [cursos, setCursos] = useState([]);
  const { profile } = useAuth();

  useEffect(()=>{
    async function load(){
      const snaps = await getDocs(collection(db, "cursos"));
      const list = snaps.docs.map(d => ({ id: d.id, ...d.data() }));
      setCursos(list);
    }
    load();
  },[]);

  return (
    <div style={{padding:24}}>
      <h1>Cursos</h1>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16,marginTop:16}}>
        {cursos.map(c => {
          const isPremium = c.tipo === "premium";
          const canWatch = !isPremium || (profile && profile.plano === "premium");
          return (
            <div key={c.id} style={{background:"#111827",padding:16,borderRadius:8}}>
              <img src={c.imagem} alt="" style={{width:"100%",height:160,objectFit:"cover",borderRadius:6}}/>
              <h3 style={{color:"#38bdf8"}}>{c.titulo}</h3>
              <p>{c.descricao}</p>
              {isPremium && <span style={{background:"#f59e0b",padding:"6px 8px",borderRadius:999,display:"inline-block"}}>Premium</span>}
              <div style={{marginTop:12}}>
                {canWatch ? (
                  <Link to={`/curso/${c.id}`}><button>Assistir</button></Link>
                ) : (
                  <Link to="/dashboard"><button>Fazer upgrade</button></Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
