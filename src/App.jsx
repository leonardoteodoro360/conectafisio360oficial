// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext"; // Corrigido de 'contextos' para 'contexts'

import Login from "./pages/Login";
import Register from "./pages/Register";
import Cursos from "./pages/Cursos";
import Curso from "./pages/Curso";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem' 
      }}>
        Carregando...
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Routes>
        {/* ROTA PRINCIPAL: Redireciona conforme o status de login */}
        <Route
          path="/"
          element={
            user ? <Navigate to="/dashboard" replace /> 
                 : <Navigate to="/login" replace />
          }
        />

        {/* ROTAS PÚBLICAS */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* ROTAS PROTEGIDAS OU DE CONTEÚDO */}
        <Route path="/cursos" element={<Cursos />} />
        <Route path="/curso/:id" element={<Curso />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* ROTA DE CAPTURA (Caso o usuário digite algo inexistente) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
