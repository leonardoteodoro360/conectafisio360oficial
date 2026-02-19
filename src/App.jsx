// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cursos from "./pages/Cursos";
import Curso from "./pages/Curso";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App(){
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/cursos" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cursos" element={<Cursos />} />
        <Route path="/curso/:id" element={<Curso />} />
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        {/* rotas de checkout/webhook success/cancel serão adicionadas conforme Stripe */}
      </Routes>
    </>
  );
}
