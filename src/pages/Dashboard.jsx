// src/pages/Dashboard.jsx
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

export default function Dashboard(){
  const { user, profile } = useAuth();

  async function startCheckout(){
    // chama sua função serverless que cria a sessão Stripe
    const resp = await axios.post("/api/create-checkout-session", {
      uid: user.uid,
      priceId: import.meta.env.VITE_STRIPE_PRICE_ID
    });
    const { url } = resp.data;
    window.location.href = url; // redireciona para Stripe Checkout
  }

  return (
    <div style={{padding:24}}>
      <h1>Painel</h1>
      <p>Bem vindo, {profile?.nome || user?.email}</p>
      <p>Plano atual: {profile?.plano || "free"}</p>

      {profile?.plano !== "premium" && (
        <div style={{marginTop:16}}>
          <button onClick={startCheckout}>Virar Premium</button>
        </div>
      )}

      {profile?.plano === "premium" && (
        <div style={{marginTop:16}}>
          ✅ Você é Premium — aproveite os cursos avançados!
        </div>
      )}
    </div>
  );
}
