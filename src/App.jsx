// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contextos/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Cursos from "./pages/Cursos";
import Curso from "./pages/Curso";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return <div style={{padding:20}}>Carregando...</div>;

  return (
    <>
      <Navbar />
      <Routes>
        {/* ROTA PRINCIPAL INTELIGENTE */}
        <Route
          path="/"
          element={
            user ? <Navigate to="/dashboard" replace /> 
                 : <Navigate to="/login" replace />
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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
      </Routes>
    </>
  );
}
