// src/components/boards/KanbanBoard.jsx
import React from 'react';
import KanbanColumn from './KanbanColumn';
import { kanbanColumns } from '../../constants/dashboardData';

const KanbanBoard = ({ tasks = [], onAddTask, onTaskClick }) => {
  // Agrupar tareas por columna
  const getTasksByColumn = (columnId) => {
    return tasks.filter(task => task.column === columnId);
  };

  return (
    <div className="kanban-board">
      {kanbanColumns.map(column => (
        <KanbanColumn
          key={column.id}
          column={column}
          tasks={getTasksByColumn(column.id)}
          onAddTask={() => onAddTask && onAddTask(column.id)}
          onTaskClick={onTaskClick}
        />
      ))}
    </div>
  );
};

export default KanbanBoard;