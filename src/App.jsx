// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TasksPage from './pages/TasksPage';
import BoardPage from './pages/BoardPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Rutas del dashboard */}
        <Route path="/dashboard" element={<TasksPage />} />
        <Route path="/dashboard/tasks" element={<TasksPage />} />
        <Route path="/dashboard/board/:id" element={<BoardPage />} />
      </Routes>
    </Router>
  );
}

export default App;