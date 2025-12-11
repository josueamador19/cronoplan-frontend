// src/pages/TaskModalExample.jsx
// Ejemplo de cómo usar el TaskModal en tus páginas

import React, { useState } from 'react';
import TaskModal from '../components/modals/TaskModal';
import { taskDetail } from '../constants/modalData';
import Button from '../components/ui/Button';

const TaskModalExample = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(taskDetail);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveTask = (updatedTask) => {
    console.log('Task saved:', updatedTask);
    setSelectedTask(updatedTask);
    // Aquí guardarías en Supabase
  };

  return (
    <div style={{ padding: '50px' }}>
      <h1>Ejemplo de Task Modal</h1>
      <Button variant="primary" onClick={handleOpenModal}>
        Abrir Modal de Tarea
      </Button>

      <TaskModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
      />
    </div>
  );
};

export default TaskModalExample;