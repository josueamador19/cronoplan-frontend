
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../ui/InputField';
import PasswordInput from '../ui/PasswordInput';
import GoogleButton from './GoogleButton';
import AuthFooter from './AuthFooter';
import { authTexts } from '../../constants/authdata';
import { loginUser, saveAuthData } from '../services/authService';

const LoginForm = ({ onGoogleLogin }) => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sessionExpiredMessage, setSessionExpiredMessage] = useState('');

  // Verificar si llegó por sesión expirada
  useEffect(() => {
    const redirectPath = localStorage.getItem('redirect_after_login');
    if (redirectPath) {
      setSessionExpiredMessage('Tu sesión expiró. Por favor, inicia sesión nuevamente.');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Ingresa un correo electrónico válido';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      setErrors({});
      
      try {
        // Llamar al backend
        const response = await loginUser(formData);
        
        // Guardar token y usuario
        saveAuthData(response);
        
        
        //console.log('Login exitoso:', response.user);
        
        // Verificar si hay una URL de redirección guardada
        const redirectPath = localStorage.getItem('redirect_after_login');
        
        if (redirectPath) {
          // Limpiar la URL guardada
          localStorage.removeItem('redirect_after_login');
          // Redirigir a la página donde estaba
          navigate(redirectPath);
        } else {
          // Redirigir al dashboard por defecto
          navigate('/dashboard');
        }
        
      } catch (error) {
        console.error('Error en el login:', error);
        
        // Manejar errores del backend
        if (error.response?.data?.detail) {
          const detail = error.response.data.detail;
          
          if (typeof detail === 'string') {
            if (detail.toLowerCase().includes('credenciales') || 
                detail.toLowerCase().includes('invalid') ||
                detail.toLowerCase().includes('incorrect')) {
              setErrors({ 
                general: 'Email o contraseña incorrectos' 
              });
            } else {
              setErrors({ general: detail });
            }
          } else {
            setErrors({ general: 'Error al iniciar sesión' });
          }
        } else if (error.request) {
          setErrors({ 
            general: 'No se pudo conectar con el servidor. Intenta más tarde.' 
          });
        } else {
          setErrors({ general: 'Error inesperado. Intenta de nuevo.' });
        }
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  const text = authTexts.login;

  return (
    <form onSubmit={handleSubmit}>
      {/* Mensaje de sesión expirada */}
      {sessionExpiredMessage && (
        <div className="session-expired-warning" style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '16px',
          color: '#856404',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {sessionExpiredMessage}
        </div>
      )}

      {/* Mostrar error general si existe */}
      {errors.general && (
        <div className="error-message general-error" style={{
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '16px',
          color: '#c33',
          fontSize: '14px'
        }}>
          {errors.general}
        </div>
      )}

      <InputField
        label={text.emailLabel}
        type="email"
        name="email"
        placeholder={text.emailPlaceholder}
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        disabled={loading}
        required
      />

      <PasswordInput
        label={text.passwordLabel}
        name="password"
        placeholder={text.passwordPlaceholder}
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        disabled={loading}
        required
      />

      {text.forgotPassword && (
        <div className="forgot-password" style={{
          textAlign: 'right',
          marginBottom: '16px'
        }}>
          <a href="/forgot-password" style={{
            color: '#1890ff',
            textDecoration: 'none',
            fontSize: '14px'
          }}>
            {text.forgotPassword}
          </a>
        </div>
      )}

      <button 
        type="submit" 
        className="auth-button"
        disabled={loading}
        style={loading ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
      >
        {loading ? 'Iniciando sesión...' : text.submitButton}
      </button>

      <div className="separator">{text.separator}</div>

      <GoogleButton 
        onClick={onGoogleLogin}
        text={text.googleButton}
        disabled={loading}
      />
      
      <AuthFooter text={text} />
    </form>
  );
};

export default LoginForm;