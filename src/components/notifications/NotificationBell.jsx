// src/components/notifications/NotificationBell.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FaBell, FaCheck, FaCheckDouble } from 'react-icons/fa';
import {
  getUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  formatDaysUntilDue,
  getDaysColor
} from '../../services/remindersService';
import '../../styles/notifications.css';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Cargar notificaciones no leídas
  useEffect(() => {
    loadNotifications();
    
    // Recargar cada 60 segundos
    const interval = setInterval(loadNotifications, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await getUnreadNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    }
  };

  const handleBellClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleNotificationClick = async (notification) => {
    try {
      await markNotificationAsRead(notification.id);
      
      // Actualizar estado local
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
      
      // Opcional: Navegar a la tarea
      // navigate(`/dashboard/task/${notification.task_id}`);
      
    } catch (error) {
      console.error('Error al marcar como leída:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setLoading(true);
      await markAllNotificationsAsRead();
      setNotifications([]);
    } catch (error) {
      console.error('Error al marcar todas como leídas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Formatear tiempo relativo
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Justo ahora';
    if (diffMins < 60) return `Hace ${diffMins} min${diffMins > 1 ? 's' : ''}`;
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
    
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  const unreadCount = notifications.length;

  return (
    <div className="notification-bell-container" ref={dropdownRef}>
      <button 
        className="notification-bell-button"
        onClick={handleBellClick}
        aria-label="Notificaciones"
      >
        <FaBell size={20} />
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="notification-dropdown">
          {/* Header */}
          <div className="notification-dropdown-header">
            <h3>Notificaciones</h3>
            {unreadCount > 0 && (
              <button
                className="mark-all-read-btn"
                onClick={handleMarkAllAsRead}
                disabled={loading}
              >
                <FaCheckDouble size={14} />
                Marcar todas
              </button>
            )}
          </div>

          {/* Lista de notificaciones */}
          <div className="notification-list">
            {unreadCount === 0 ? (
              <div className="no-notifications">
                <FaBell size={48} color="#d9d9d9" />
                <p>No tienes notificaciones nuevas</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className="notification-item"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-icon">
                    {notification.notification_type === 'reminder' ? '⏰' : '🔔'}
                  </div>
                  
                  <div className="notification-content">
                    <div className="notification-title">
                      {notification.title}
                    </div>
                    <div className="notification-message">
                      {notification.message}
                    </div>
                    <div className="notification-time">
                      {formatTimeAgo(notification.created_at)}
                    </div>
                  </div>

                  <button 
                    className="notification-mark-read"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNotificationClick(notification);
                    }}
                    aria-label="Marcar como leída"
                  >
                    <FaCheck size={12} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {unreadCount > 0 && (
            <div className="notification-dropdown-footer">
              <button className="view-all-btn">
                Ver todas las notificaciones
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;