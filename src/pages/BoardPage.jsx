// src/pages/BoardPage.jsx
import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import BoardHeader from '../components/boards/BoardHeader';
import KanbanBoard from '../components/boards/KanbanBoard';
import { tasks, boards } from '../constants/dashboardData';

const BoardPage = ({ boardId = 2 }) => {
  const [viewMode, setViewMode] = useState('kanban');
  
  // Obtener el tablero actual
  const currentBoard = boards.find(b => b.id === boardId) || boards[1];
  
  // Filtrar tareas del tablero actual
  const boardTasks = tasks.filter(task => task.boardId === boardId);

  // Miembros del equipo (ejemplo)
  const members = [
    { name: 'Juan Pérez', avatar: 'https://i.pravatar.cc/150?img=1' },
    { name: 'María López', avatar: 'https://i.pravatar.cc/150?img=2' },
    { name: 'Carlos Ruiz', avatar: 'https://i.pravatar.cc/150?img=3' }
  ];

  const handleAddTask = (columnId) => {
    console.log('Añadir tarea a columna:', columnId);
    alert(`Crear tarea en columna: ${columnId}`);
  };

  const handleTaskClick = (task) => {
    console.log('Click en tarea:', task);
    alert(`Ver detalles de: ${task.title}`);
  };

  return (
    <DashboardLayout activeItem="tableros" activeBoard={boardId}>
      <BoardHeader 
        board={currentBoard}
        members={members}
        viewMode={viewMode}
        onViewChange={setViewMode}
      />
      
      <KanbanBoard 
        tasks={boardTasks}
        onAddTask={handleAddTask}
        onTaskClick={handleTaskClick}
      />
    </DashboardLayout>
  );
};

export default BoardPage;