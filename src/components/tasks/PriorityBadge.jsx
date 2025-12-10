// src/components/tasks/PriorityBadge.jsx
import React from 'react';
import { priorityColors } from '../../constants/dashboardData';

const PriorityBadge = ({ priority }) => {
  const colors = priorityColors[priority] || priorityColors['Baja'];
  
  return (
    <span 
      className="priority-badge"
      style={{ 
        backgroundColor: colors.bg,
        color: colors.text
      }}
    >
      {colors.icon} {priority}
    </span>
  );
};

export default PriorityBadge;