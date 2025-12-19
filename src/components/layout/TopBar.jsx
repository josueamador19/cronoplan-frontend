import React, { useState, useRef, useEffect } from 'react';
import { FaUserEdit, FaSignOutAlt } from 'react-icons/fa';
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
  const navigate = useNavigate();
  const [user, setUser] = useState(getStoredUser());

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

  // Actualizar usuario cuando cambie el localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setUser(getStoredUser());
    };

    // Escuchar cambios en localStorage
    window.addEventListener('storage', handleStorageChange);
    
    // También escuchar un evento personalizado para cambios en la misma pestaña
    window.addEventListener('userUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userUpdated', handleStorageChange);
    };
  }, []);

  const handleLogout = async () => {
    setIsMenuOpen(false);
    await logoutUser();
    navigate('/');
  };

  const handleEditProfile = () => {
    setIsMenuOpen(false);
    navigate('/dashboard/profile');
  };

  // Obtener avatar del usuario o usar uno por defecto
  const userAvatar = user?.avatar_url || "https://i.pravatar.cc/150?img=12";

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
                Crear Tablero
              </Button>
              <Button variant="primary" size="sm" onClick={() => setIsTaskModalOpen(true)}>
                Crear Actividad
              </Button>
            </>
          )}

          {/* AVATAR + MENU SIMPLE */}
          <div className="user-menu" ref={menuRef}>
            <img
              src={userAvatar}
              alt="Usuario"
              className="user-avatar"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            />

            {isMenuOpen && (
              <div className="user-dropdown">
                <button className="dropdown-item" onClick={handleEditProfile}>
                  <FaUserEdit />
                  <span>Editar perfil</span>
                </button>
                <button className="dropdown-item logout" onClick={handleLogout}>
                  <FaSignOutAlt />
                  <span>Cerrar sesión</span>
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