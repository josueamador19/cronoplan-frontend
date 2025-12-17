
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, verifyToken } from '../services/authService';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated()) {
        console.log('No hay token, redirigiendo al login');
        localStorage.setItem('redirect_after_login', location.pathname);
        setIsValid(false);
        setIsChecking(false);
        return;
      }

      
      try {
        const valid = await verifyToken();
        
        if (valid) {
          //console.log('Token válido');
          setIsValid(true);
        } else {
          //console.log('Token inválido');
          localStorage.setItem('redirect_after_login', location.pathname);
          setIsValid(false);
        }
      } catch (error) {
        //console.log('Error verificando token:', error);
        localStorage.setItem('redirect_after_login', location.pathname);
        setIsValid(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [location.pathname]);

  
  if (isChecking) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Verificando sesión...
      </div>
    );
  }

  // Si no es válido, redirigir al login
  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  // Si es válido, mostrar el contenido
  return children;
};

export default ProtectedRoute;