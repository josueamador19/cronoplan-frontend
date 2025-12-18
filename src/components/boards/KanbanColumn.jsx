import React from 'react';
import TaskCard from './TaskCard';

const KanbanColumn = ({ 
  column, 
  tasks = [], 
  onAddTask, 
  onTaskClick,
  onDragStart,
  onDrop,
  isDragging,
  isDropTarget
}) => {
  
  const handleDragOver = (e) => {
    e.preventDefault(); 
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (onDrop) {
      onDrop();
    }
  };

  return (
    <div 
      className={`kanban-column ${isDropTarget ? 'drop-target' : ''}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="kanban-column-header">
        <div className="column-title">
          <h3>{column.title}</h3>
          <span className="column-count">{tasks.length}</span>
        </div>
        {onAddTask && (
          <button className="add-task-btn" onClick={onAddTask} title="Agregar tarea">
            +
          </button>
        )}
      </div>

      <div className="kanban-column-content">
        {tasks.length === 0 ? (
          <div className="empty-column">
            <p>No hay tareas</p>
            <p>Arrastra o crea una nueva actividad</p>
          </div>
        ) : (
          tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick && onTaskClick(task)}
              onDragStart={() => onDragStart && onDragStart(task)}
              draggable={true}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
