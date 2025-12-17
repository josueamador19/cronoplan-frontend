
import React from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import PriorityBadge from '../tasks/PriorityBadge';
import StatusBadge from '../tasks/StatusBadge';

const TaskCard = ({ task, onClick, onDragStart, draggable = true }) => {
  
  const handleDragStart = (e) => {
    if (onDragStart) {
      onDragStart(task);
    }
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleClick = (e) => {
    if (onClick && !e.defaultPrevented) {
      onClick(task);
    }
  };

  return (
    <div 
      className={`task-card ${task.completed ? 'completed' : ''}`}
      onClick={handleClick}
      draggable={draggable}
      onDragStart={handleDragStart}
    >
      <div className="task-card-header">
        <PriorityBadge priority={task.priority} />
        {task.completed && (
          <span className="completed-badge">✓</span>
        )}
      </div>
      
      <h4 className="task-card-title">{task.title}</h4>
      
      {task.status && (
        <StatusBadge status={task.status} color={task.statusColor} />
      )}
      
      <div className="task-card-footer">
        <div className="task-date">
          <FaCalendarAlt />
          <span>{task.dueDate}</span>
        </div>
        {task.assignee && task.assignee.avatar && (
          <img 
            src={task.assignee.avatar} 
            alt={task.assignee.name}
            className="task-assignee-avatar"
            title={task.assignee.name}
          />
        )}
      </div>
    </div>
  );
};

export default TaskCard;