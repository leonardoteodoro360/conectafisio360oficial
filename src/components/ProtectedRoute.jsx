// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children }){
  const { user, loading } = useAuth();
  if(loading) return <div style={{padding:40}}>Carregando...</div>;
  if(!user) return <Navigate to="/login" replace />;
  return children;
}
