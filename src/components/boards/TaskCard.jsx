import React, { useState } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import PriorityBadge from '../tasks/PriorityBadge';
import StatusBadge from '../tasks/StatusBadge';
import EditTaskModal from '../modals/EditTaskModal';
import '../../styles/taskCard.css';

const TaskCard = ({ 
  task, 
  onClick, 
  onDragStart, 
  draggable = true, 
  onTaskUpdate, 
  onTaskDelete,
  boards = [] 
}) => {
  const [showModal, setShowModal] = useState(false);

  //console.log('🎴 TaskCard - Boards recibidos:', boards); 

  const handleDragStart = (e) => {
    if (onDragStart) {
      onDragStart(task);
    }
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleCardClick = (e) => {
    setShowModal(true);
    if (onClick) {
      onClick(task);
    }
  };

  const getDisplayDate = () => {
    
    if (task.dueDate) return task.dueDate;
    
    if (task.due_date) return task.due_date;
    
    return 'Sin fecha';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Sin fecha';
    
    try {
      
      const date = new Date(dateStr);
      
      
      if (isNaN(date.getTime())) {
        return 'Sin fecha';
      }
      
      return date.toLocaleDateString('es-ES', { 
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formateando fecha:', error);
      return 'Sin fecha';
    }
  };

  return (
    <>
      <div 
        className={`task-card ${task.completed ? 'completed' : ''}`}
        onClick={handleCardClick}
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
        
        {task.status_badge && (
          <StatusBadge status={task.status_badge} color={task.status_badge_color} />
        )}
        
        <div className="task-card-footer">
          <div className="task-date">
            <FaCalendarAlt />
            <span>{getDisplayDate()}</span>
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

      {/* Modal de Ver/Editar */}
      <EditTaskModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        task={task}
        boards={boards}
        onTaskUpdate={onTaskUpdate}
        onTaskDelete={onTaskDelete}
      />
    </>
  );
};

export default TaskCard;