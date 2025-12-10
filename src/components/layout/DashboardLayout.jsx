// src/components/layout/DashboardLayout.jsx
import React from 'react';
import Sidebar from './Sidebar';
import '../../styles/dashboard.css';

const DashboardLayout = ({ 
  children, 
  activeItem, 
  activeBoard,
  onNavigate 
}) => {
  return (
    <div className="dashboard-container">
      <Sidebar 
        activeItem={activeItem}
        activeBoard={activeBoard}
        onNavigate={onNavigate}
      />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;