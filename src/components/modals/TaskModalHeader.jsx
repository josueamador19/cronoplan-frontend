// src/components/modals/TaskModalHeader.jsx
import React from 'react';
import { FaTimes, FaChevronDown } from 'react-icons/fa';

const TaskModalHeader = ({ 
  board, 
  boardIcon,
  status, 
  statusColor,
  priority, 
  onPriorityChange, 
  onMove, 
  onClose 
}) => {
  return (
    <div className="task-modal-header">
      <div className="task-modal-badges">
        <div className="task-modal-badge">
          {boardIcon} {board}
        </div>
        <div 
          className="task-modal-badge"
          style={{ 
            backgroundColor: `${statusColor}20`,
            color: statusColor,
            borderColor: `${statusColor}40`
          }}
        >
          🟡 {status}
        </div>
        <button className="task-modal-badge" onClick={onPriorityChange}>
          🔴 {priority} <FaChevronDown size={12} />
        </button>
      </div>

      <div className="task-modal-actions">
        <button className="modal-action-btn" onClick={onMove}>
          🔄 Mover <FaChevronDown size={12} />
        </button>
        <button className="modal-close-btn" onClick={onClose}>
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

export default TaskModalHeader;