// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TasksPage from './pages/TasksPage';
import BoardsListPage from './pages/BoardsListPage';
import BoardPage from './pages/BoardPage';
//import CalendarPage from './pages/CalendarPage';
//import RemindersPage from './pages/RemindersPage';
import TaskModalExample from './pages/TaskModalExample';
import { isAuthenticated } from './components/services/authService';
import './App.css';
import DashboardPage from './pages/DashboardPage';

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Componente para rutas públicas (redirige al dashboard si ya está autenticado)
const PublicRoute = ({ children }) => {
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* ========================================= */}
        {/* RUTAS PÚBLICAS */}
        {/* ========================================= */}
        
        <Route 
          path="/" 
          element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          } 
        />
        
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } 
        />
        
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          } 
        />
        
        {/* ========================================= */}
        {/* RUTAS DEL DASHBOARD (PROTEGIDAS) */}
        {/* ========================================= */}
        
        {/* Inicio - Dashboard general con resumen */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Mis Actividades - Lista de todas las tareas */}
        <Route 
          path="/dashboard/tasks" 
          element={
            <ProtectedRoute>
              <TasksPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Mis Tableros - Lista de tableros */}
        <Route 
          path="/dashboard/boards" 
          element={
            <ProtectedRoute>
              <BoardsListPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Board específico - Vista Kanban de un tablero */}
        <Route 
          path="/dashboard/board/:id" 
          element={
            <ProtectedRoute>
              <BoardPage />
            </ProtectedRoute>
          } 
        />
        
        {/**
        <Route 
          path="/dashboard/calendar" 
          element={
            <ProtectedRoute>
              <CalendarPage />
            </ProtectedRoute>
          } 
        />
        
      
        <Route 
          path="/dashboard/reminders" 
          element={
            <ProtectedRoute>
              <RemindersPage />
            </ProtectedRoute>
          } 
        /> */}
        
        {/* ========================================= */}
        {/* RUTAS DE PRUEBA / DESARROLLO */}
        {/* ========================================= */}
        
        <Route path="/modal-test" element={<TaskModalExample />} />
        
        {/* ========================================= */}
        {/* RUTA 404 - No encontrada */}
        {/* ========================================= */}
        
        <Route 
          path="*" 
          element={
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100vh',
              gap: '20px'
            }}>
              <h1 style={{ fontSize: '72px', margin: 0 }}>404</h1>
              <h2>Página no encontrada</h2>
              <a 
                href="/dashboard" 
                style={{
                  padding: '10px 24px',
                  backgroundColor: '#1890ff',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '6px'
                }}
              >
                Ir al Dashboard
              </a>
            </div>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;