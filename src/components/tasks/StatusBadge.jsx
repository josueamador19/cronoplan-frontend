// src/components/tasks/StatusBadge.jsx
import React from 'react';

const StatusBadge = ({ status, color }) => {
  return (
    <span 
      className="status-badge"
      style={{ 
        backgroundColor: `${color}20`,
        color: color
      }}
    >
      {status}
    </span>
  );
};

export default StatusBadge;