
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaClock, FaPlus } from 'react-icons/fa';
import { menuItems } from '../../constants/dashboardData';
import { getAllBoards } from '../../components/services/boardsService';
import CreateBoardModal from '../modals/CreateBoardModal';

const Sidebar = ({ activeItem = 'inicio', activeBoard = null }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [boards, setBoards] = useState([]);
  const [loadingBoards, setLoadingBoards] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Cargar boards dinámicamente
  useEffect(() => {
    loadBoards();
  }, []);

  const loadBoards = async () => {
    try {
      setLoadingBoards(true);
      const boardsData = await getAllBoards();
      setBoards(boardsData);
      console.log('Boards cargados en sidebar:', boardsData.length);
    } catch (error) {
      console.error('Error al cargar boards en sidebar:', error);
    } finally {
      setLoadingBoards(false);
    }
  };

  // Manejar navegación de menú
  const handleNavigate = (path) => {
    navigate(path);
  };

  // Manejar click en board
  const handleBoardClick = (boardId) => {
    navigate(`/dashboard/board/${boardId}`);
  };

  // Manejar crear nuevo tablero
  const handleCreateBoard = () => {
    setIsModalOpen(true);
  };

  // Manejar cierre del modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Manejar éxito al crear tablero
  const handleBoardCreated = async (newBoard) => {
    //console.log('Tablero creado exitosamente:', newBoard);
    
    // Recargar la lista de boards
    await loadBoards();
    
    // Opcional: navegar al nuevo tablero
    if (newBoard && newBoard.id) {
      navigate(`/dashboard/board/${newBoard.id}`);
    }
  };

  // Determinar el item activo basado en la ruta actual
  const getActiveItem = () => {
    const path = location.pathname;
    
    if (path === '/dashboard') return 'inicio';
    if (path === '/dashboard/tasks') return 'actividades';
    if (path === '/dashboard/boards') return 'tableros';
    if (path === '/dashboard/calendar') return 'calendario';
    if (path === '/dashboard/reminders') return 'recordatorios';
    if (path.startsWith('/dashboard/board/')) return 'tableros';
    
    return activeItem;
  };

  // Determinar si un board está activo
  const isBoardActive = (boardId) => {
    const path = location.pathname;
    return path === `/dashboard/board/${boardId}`;
  };

  const currentActiveItem = getActiveItem();

  return (
    <>
      
      <div className="sidebar">
        {/* Logo */}
        <div className="sidebar-logo" onClick={() => handleNavigate('/dashboard')}>
          <div className="sidebar-logo-icon">
            <FaClock />
          </div>
          <span>CronoPlan</span>
        </div>

        

        {/* Menú principal */}
        <ul className="sidebar-menu">
          {menuItems.map(item => (
            <li 
              key={item.id}
              className={`sidebar-item ${currentActiveItem === item.id ? 'active' : ''}`}
              onClick={() => handleNavigate(item.path)}
              style={{ cursor: 'pointer' }}
            >
              <span className="sidebar-item-icon">{item.icon}</span>
              <span>{item.name}</span>
            </li>
          ))}
        </ul>

        {/* Sección de tableros */}
        <div className="sidebar-section-title">
          Tableros
          <FaPlus 
            className="add-board-icon" 
            onClick={handleCreateBoard}
            style={{ cursor: 'pointer' }}
            title="Crear nuevo tablero"
          />
        </div>

        {/* Lista de tableros dinámica */}
        <ul className="board-list">
          {loadingBoards ? (
            <li style={{ 
              padding: '8px 16px', 
              fontSize: '12px', 
              color: '#999',
              textAlign: 'center'
            }}>
              Cargando...
            </li>
          ) : boards.length === 0 ? (
            <li style={{ 
              padding: '8px 16px', 
              fontSize: '12px', 
              color: '#999',
              textAlign: 'center'
            }}>
              No hay tableros
            </li>
          ) : (
            boards.map(board => (
              <li 
                key={board.id}
                className={`board-list-item ${isBoardActive(board.id) ? 'active' : ''}`}
                onClick={() => handleBoardClick(board.id)}
                style={{ cursor: 'pointer' }}
                title={`${board.name} (${board.task_count || 0} tareas)`}
              >
                <span 
                  className="board-color-indicator" 
                  style={{ backgroundColor: board.color }}
                />
                <span className="board-name">{board.icon} {board.name}</span>
                <span className="board-task-count">
                  {board.task_count || 0}
                </span>
              </li>
            ))
          )}
        </ul>

        {/* Botón de nuevo tablero */}
        <button 
          className="new-board-btn"
          onClick={handleCreateBoard}
        >
          <FaPlus />
          Nuevo tablero
        </button>
      </div>

      {/* ⭐ MODAL - Fuera del sidebar, se renderiza a nivel raíz */}
      {isModalOpen && (
        <CreateBoardModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSuccess={handleBoardCreated}
        />
      )}
    </>
  );
};

export default Sidebar;