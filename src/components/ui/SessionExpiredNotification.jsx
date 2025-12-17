// src/components/ui/SessionExpiredNotification.jsx
import React, { useState, useEffect } from 'react';
import '../../styles/SessionExpiredNotification.css';

const SessionExpiredNotification = () => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleSessionExpired = (event) => {
      setMessage(event.detail.message);
      setShow(true);

      // Ocultar después de 3 segundos
      setTimeout(() => {
        setShow(false);
      }, 3000);
    };

    // Escuchar el evento personalizado
    window.addEventListener('auth:session-expired', handleSessionExpired);

    // Cleanup
    return () => {
      window.removeEventListener('auth:session-expired', handleSessionExpired);
    };
  }, []);

  if (!show) return null;

  return (
    <div className="session-expired-notification">
      <div className="notification-content">
        <div className="notification-icon">
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <div className="notification-message">
          <strong>Sesión Expirada</strong>
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default SessionExpiredNotification;