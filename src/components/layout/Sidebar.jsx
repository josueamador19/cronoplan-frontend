// src/components/layout/Sidebar.jsx
import React from 'react';
import { FaClock, FaPlus } from 'react-icons/fa';
import { menuItems, boards } from '../../constants/dashboardData';

const Sidebar = ({ activeItem = 'actividades', activeBoard = null, onNavigate }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-logo" onClick={() => onNavigate && onNavigate('/')}>
        <div className="sidebar-logo-icon">
          <FaClock />
        </div>
        <span>CronoPlan</span>
      </div>

      <input 
        type="text" 
        className="sidebar-search" 
        placeholder="Buscar..."
      />

      <ul className="sidebar-menu">
        {menuItems.map(item => (
          <li 
            key={item.id}
            className={`sidebar-item ${activeItem === item.id ? 'active' : ''}`}
            onClick={() => onNavigate && onNavigate(item.path)}
          >
            <span className="sidebar-item-icon">{item.icon}</span>
            <span>{item.name}</span>
          </li>
        ))}
      </ul>

      <div className="sidebar-section-title">
        Tableros
        <FaPlus className="add-board-icon" />
      </div>

      <ul className="board-list">
        {boards.map(board => (
          <li 
            key={board.id}
            className={`board-list-item ${activeBoard === board.id ? 'active' : ''}`}
            onClick={() => onNavigate && onNavigate(`/dashboard/board/${board.id}`)}
          >
            <span 
              className="board-color-indicator" 
              style={{ backgroundColor: board.color }}
            />
            <span>{board.name}</span>
          </li>
        ))}
      </ul>

      <button className="new-board-btn">
        <FaPlus />
        Nuevo tablero
      </button>
    </div>
  );
};

export default Sidebar;