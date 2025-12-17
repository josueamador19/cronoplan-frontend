
import React, { useState } from 'react';
import KanbanColumn from './KanbanColumn';
import { kanbanColumns } from '../../constants/dashboardData';
import { updateTaskStatus } from '../services/tasksService';

const KanbanBoard = ({ tasks = [], onAddTask, onTaskClick, onTaskUpdate }) => {
  const [draggingTask, setDraggingTask] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Agrupar tareas por columna
  const getTasksByColumn = (columnId) => {
    return tasks.filter(task => task.column === columnId);
  };

  // Manejar inicio de drag
  const handleDragStart = (task) => {
    setDraggingTask(task);
    setIsDragging(true);
  };

  // Manejar drop en una columna
  const handleDrop = async (columnId) => {
    if (!draggingTask) return;

    // Si la tarea ya está en esta columna, no hacer nada
    if (draggingTask.column === columnId) {
      setDraggingTask(null);
      setIsDragging(false);
      return;
    }

    try {
      //console.log(`Moviendo tarea ${draggingTask.id} a columna ${columnId}`);
      
      // Actualizar en el backend
      await updateTaskStatus(draggingTask.id, columnId);
      
      
      
      // Notificar al componente padre para que recargue los datos
      if (onTaskUpdate) {
        onTaskUpdate();
      }
      
    } catch (error) {
      console.error('Error al mover tarea:', error);
      alert('Error al mover la tarea. Intenta de nuevo.');
    } finally {
      setDraggingTask(null);
      setIsDragging(false);
    }
  };

  return (
    <div className={`kanban-board ${isDragging ? 'dragging' : ''}`}>
      {kanbanColumns.map(column => (
        <KanbanColumn
          key={column.id}
          column={column}
          tasks={getTasksByColumn(column.id)}
          onAddTask={() => onAddTask && onAddTask(column.id)}
          onTaskClick={onTaskClick}
          onDragStart={handleDragStart}
          onDrop={() => handleDrop(column.id)}
          isDragging={isDragging}
          isDropTarget={draggingTask && draggingTask.column !== column.id}
        />
      ))}
    </div>
  );
};

export default KanbanBoard;