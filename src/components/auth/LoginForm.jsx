// src/components/auth/LoginForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../ui/InputField';
import PasswordInput from '../ui/PasswordInput';
import GoogleButton from './GoogleButton';
import AuthFooter from './AuthFooter';
import { authTexts } from '../../constants/authData';
import { loginUser, saveAuthData } from '../services/authService';

const LoginForm = ({ onGoogleLogin }) => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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
        
        // Mostrar mensaje de éxito
        console.log('✅ Login exitoso:', response.user);
        
        // Redirigir al dashboard
        navigate('/dashboard');
        
      } catch (error) {
        console.error('❌ Error en el login:', error);
        
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
            general: '❌ No se pudo conectar con el servidor. Verifica que tu backend esté corriendo en http://localhost:8000' 
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
        {loading ? '⏳ Iniciando sesión...' : text.submitButton}
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