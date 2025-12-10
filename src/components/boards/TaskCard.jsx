// src/components/boards/TaskCard.jsx
import React from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import PriorityBadge from '../tasks/PriorityBadge';
import StatusBadge from '../tasks/StatusBadge';

const TaskCard = ({ task, onClick }) => {
  return (
    <div className="task-card" onClick={onClick}>
      <div className="task-card-header">
        <PriorityBadge priority={task.priority} />
      </div>
      
      <h4 className="task-card-title">{task.title}</h4>
      
      <StatusBadge status={task.status} color={task.statusColor} />
      
      <div className="task-card-footer">
        <div className="task-date">
          <FaCalendarAlt />
          <span>{task.dueDate}</span>
        </div>
        <img 
          src={task.assignee.avatar} 
          alt={task.assignee.name}
          className="task-assignee-avatar"
          title={task.assignee.name}
        />
      </div>
    </div>
  );
};

export default TaskCard;