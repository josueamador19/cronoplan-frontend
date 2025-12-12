import React, { useState, useRef, useEffect } from 'react';
import { FaBell, FaUserEdit, FaSignOutAlt } from 'react-icons/fa';
import Button from '../ui/Button';
import CreateBoardModal from '../modals/CreateBoardModal';
import CreateTaskModal from '../modals/CreateTaskModal';
import { logoutUser, getStoredUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';


const TopBar = ({
  title,
  subtitle,
  showActions = true,
  currentBoardId = null,
  onBoardCreated,
  onTaskCreated
}) => {
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuRef = useRef(null);

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigate = useNavigate();
const user = getStoredUser();

const handleLogout = async () => {
  await logoutUser();
  navigate('/');
};

const handleEditProfile = () => {
  navigate('/dashboard/profile');
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
              <Button variant="outline" size="sm" onClick={() => setIsBoardModalOpen(true)}>
                📊 Crear Tablero
              </Button>
              <Button variant="primary" size="sm" onClick={() => setIsTaskModalOpen(true)}>
                ➕ Crear Actividad
              </Button>
            </>
          )}

          <div className="notification-icon">
            <FaBell />
            <span className="notification-badge">3</span>
          </div>

          {/* AVATAR + MENU */}
          <div className="user-menu" ref={menuRef}>
            <img
              src="https://i.pravatar.cc/150?img=12"
              alt="Usuario"
              className="user-avatar"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            />

            {isMenuOpen && (
              <div className="user-dropdown">
                <button onClick={handleEditProfile}>
                  <FaUserEdit />
                  Editar perfil
                </button>
                <button className="logout" onClick={handleLogout}>
                  <FaSignOutAlt />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateBoardModal
        isOpen={isBoardModalOpen}
        onClose={() => setIsBoardModalOpen(false)}
        onSuccess={onBoardCreated}
      />

      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSuccess={onTaskCreated}
        defaultBoardId={currentBoardId}
      />
    </>
  );
};

export default TopBar;
