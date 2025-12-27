import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TasksPage from './pages/TasksPage';
import BoardsListPage from './pages/BoardsListPage';
import BoardPage from './pages/BoardPage';
import CalendarPage from './pages/CalendarPage';
import DashboardPage from './pages/DashboardPage';
import Profile from './pages/Profile';
import RemindersPage from './pages/RemindersPage';
import { 
  isAuthenticated, 
  initializeAuth, 
  startTokenRefreshTimer 
} from './components/services/authService';
import SessionExpiredNotification from './components/ui/SessionExpiredNotification';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './App.css';

// ===============================
// RUTA PÚBLICA
// ===============================
const PublicRoute = ({ children }) => {
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

// ===============================
// LOADING COMPONENT
// ===============================
const LoadingScreen = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f0f2f5',
      gap: '20px'
    }}
  >
    <div
      style={{
        width: '50px',
        height: '50px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #1890ff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}
    />
    <p style={{ color: '#666', fontSize: '16px' }}>Verificando sesión...</p>
    
    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
  </div>
);

function App() {
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      //console.log('Verificando autenticación al iniciar...');
      
      if (isAuthenticated()) {
        try {
          // Verificar y renovar tokens si es necesario
          await initializeAuth();
          
          // Iniciar timer de renovación automática
          startTokenRefreshTimer();
          
          //console.log(' Autenticación verificada exitosamente');
        } catch (error) {
          console.error(' Error al inicializar autenticación:', error);
        }
      } else {
        console.log('Usuario no autenticado');
      }
      
      setIsAuthChecked(true);
    };

    checkAuth();
  }, []);

  // Mostrar loader mientras se verifica la autenticación
  if (!isAuthChecked) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      {/* NOTIFICACIÓN GLOBAL DE SESIÓN EXPIRADA */}
      <SessionExpiredNotification />
      
      <Routes>
        {/* ============================= */}
        {/* RUTAS PÚBLICAS */}
        {/* ============================= */}

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

        {/* ============================= */}
        {/* RUTAS PROTEGIDAS - DASHBOARD */}
        {/* ============================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/tasks"
          element={
            <ProtectedRoute>
              <TasksPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/boards"
          element={
            <ProtectedRoute>
              <BoardsListPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/board/:id"
          element={
            <ProtectedRoute>
              <BoardPage />
            </ProtectedRoute>
          }
        />

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
        />

        {/* ============================= */}
        {/* PERFIL DEL USUARIO LOGUEADO */}
        {/* ============================= */}

        <Route
          path="/dashboard/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* ============================= */}
        {/* 404 */}
        {/* ============================= */}

        <Route
          path="*"
          element={
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                gap: '20px'
              }}
            >
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