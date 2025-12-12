import React from 'react';
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

import { isAuthenticated } from './components/services/authService';
import './App.css';

// ===============================
// RUTA PROTEGIDA
// ===============================
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// ===============================
// RUTA PÚBLICA
// ===============================
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
