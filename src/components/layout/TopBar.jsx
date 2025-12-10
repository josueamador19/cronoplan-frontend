// src/components/layout/TopBar.jsx
import React from 'react';
import { FaBell } from 'react-icons/fa';
import Button from '../ui/Button';

const TopBar = ({ 
  title, 
  subtitle, 
  showActions = true,
  onCreateBoard,
  onCreateTask 
}) => {
  return (
    <div className="top-bar">
      <div className="top-bar-title">
        <h1>{title}</h1>
        {subtitle && <p className="top-bar-subtitle">{subtitle}</p>}
      </div>

      <div className="top-bar-actions">
        {showActions && (
          <>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onCreateBoard}
            >
              📊 Crear Tablero
            </Button>
            <Button 
              variant="primary" 
              size="sm"
              onClick={onCreateTask}
            >
              ➕ Crear Actividad
            </Button>
          </>
        )}
        
        <div className="notification-icon">
          <FaBell />
          <span className="notification-badge">3</span>
        </div>

        <img 
          src="https://i.pravatar.cc/150?img=12" 
          alt="Usuario" 
          className="user-avatar"
        />
      </div>
    </div>
  );
};

export default TopBar;