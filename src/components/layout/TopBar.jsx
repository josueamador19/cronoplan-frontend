// src/components/layout/TopBar.jsx
import React, { useState } from 'react';
import { FaBell } from 'react-icons/fa';
import Button from '../ui/Button';
import CreateBoardModal from '../modals/CreateBoardModal';
import CreateTaskModal from '../modals/CreateTaskModal';

const TopBar = ({ 
  title, 
  subtitle, 
  showActions = true,
  currentBoardId = null, // Para pre-seleccionar el board actual
  onBoardCreated, // Callback cuando se crea un board
  onTaskCreated // Callback cuando se crea una tarea
}) => {
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Manejar apertura de modales
  const handleOpenBoardModal = () => {
    setIsBoardModalOpen(true);
  };

  const handleOpenTaskModal = () => {
    setIsTaskModalOpen(true);
  };

  // Manejar cierre de modales
  const handleCloseBoardModal = () => {
    setIsBoardModalOpen(false);
  };

  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false);
  };

  // Callbacks de éxito
  const handleBoardCreated = (newBoard) => {
    console.log('✅ Board creado desde TopBar:', newBoard);
    if (onBoardCreated) {
      onBoardCreated(newBoard);
    }
  };

  const handleTaskCreated = (newTask) => {
    console.log('✅ Tarea creada desde TopBar:', newTask);
    if (onTaskCreated) {
      onTaskCreated(newTask);
    }
  };

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-title">
          <h1>{title}</h1>
          {subtitle && <p className="top-bar-subtitle">{subtitle}</p>}
        </div>

        <div className="top-bar-actions">
          {showActions && (
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleOpenBoardModal}
              >
                📊 Crear Tablero
              </Button>
              <Button 
                variant="primary" 
                size="sm"
                onClick={handleOpenTaskModal}
              >
                ➕ Crear Actividad
              </Button>
            </>
          )}
          
          <div className="notification-icon">
            <FaBell />
            <span className="notification-badge">3</span>
          </div>

          <img 
            src="https://i.pravatar.cc/150?img=12" 
            alt="Usuario" 
            className="user-avatar"
          />
        </div>
      </div>

      {/* Modal para crear tablero */}
      <CreateBoardModal
        isOpen={isBoardModalOpen}
        onClose={handleCloseBoardModal}
        onSuccess={handleBoardCreated}
      />

      {/* Modal para crear tarea */}
      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={handleCloseTaskModal}
        onSuccess={handleTaskCreated}
        defaultBoardId={currentBoardId}
      />
    </>
  );
};

export default TopBar;