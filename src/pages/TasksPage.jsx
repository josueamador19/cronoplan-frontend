// src/pages/TasksPage.jsx
import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import TopBar from '../components/layout/TopBar';
import TaskList from '../components/tasks/TaskList';
import { tasks } from '../constants/dashboardData';

const TasksPage = () => {
  const [activeFilters, setActiveFilters] = useState([
    { id: 'priority', label: 'Prioridad', value: 'Alta' },
    { id: 'board', label: 'Tablero', value: 'Diseño UI/UX' }
  ]);

  const handleRemoveFilter = (filterId) => {
    setActiveFilters(prev => prev.filter(f => f.id !== filterId));
  };

  const handleClearFilters = () => {
    setActiveFilters([]);
  };

  const handleCreateTask = () => {
    console.log('Crear nueva tarea');
    alert('Abrir modal de crear tarea');
  };

  const handleCreateBoard = () => {
    console.log('Crear nuevo tablero');
    alert('Abrir modal de crear tablero');
  };

  return (
    <DashboardLayout activeItem="actividades">
      <TopBar 
        title="Mis Actividades"
        subtitle="Gestión global de tareas pendientes"
        onCreateTask={handleCreateTask}
        onCreateBoard={handleCreateBoard}
      />
      
      <TaskList 
        tasks={tasks}
        filters={activeFilters}
        onFilterRemove={handleRemoveFilter}
        onClearFilters={handleClearFilters}
      />
    </DashboardLayout>
  );
};

export default TasksPage;