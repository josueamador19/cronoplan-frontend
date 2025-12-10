// src/components/boards/KanbanColumn.jsx
import React from 'react';
import { FaEllipsisH, FaPlus } from 'react-icons/fa';
import TaskCard from './TaskCard';

const KanbanColumn = ({ column, tasks = [], onAddTask, onTaskClick }) => {
  return (
    <div className="kanban-column">
      <div className="kanban-column-header">
        <div className="kanban-column-title">
          <span>{column.title}</span>
          <span className="task-count">{tasks.length}</span>
        </div>
        <button className="column-menu-btn">
          <FaEllipsisH />
        </button>
      </div>

      <div className="kanban-tasks">
        {tasks.map(task => (
          <TaskCard 
            key={task.id}
            task={task}
            onClick={() => onTaskClick && onTaskClick(task)}
          />
        ))}
      </div>

      <button className="add-task-btn" onClick={onAddTask}>
        <FaPlus />
        Añadir actividad
      </button>
    </div>
  );
};

export default KanbanColumn;