import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../ui/InputField';
import PasswordInput from '../ui/PasswordInput';
import GoogleButton from './GoogleButton';
import AuthFooter from './AuthFooter';
import { authTexts } from '../../constants/authData';
import { registerUser, saveAuthData } from '../services/authService';

const RegisterForm = ({ onGoogleLogin }) => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
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
    
    // Validar nombre completo
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'El nombre completo es requerido';
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'El nombre debe tener al menos 3 caracteres';
    }
    
    // Validar email
    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Ingresa un correo electrónico válido';
    }
    
    // Validar teléfono (opcional pero con formato si se proporciona)
    if (formData.phone && !/^[\d\s\+\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Ingresa un número de teléfono válido';
    }
    
    // Validar contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Debes confirmar tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
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
        const response = await registerUser(formData);
        
        // Guardar token y usuario
        saveAuthData(response);
        
        
        //console.log('Usuario registrado exitosamente:', response.user);
        
        // Redirigir al dashboard
        navigate('/dashboard');
        
      } catch (error) {
        console.error('Error en el registro:', error);
        
        // Manejar errores del backend
        if (error.response?.data?.detail) {
          const detail = error.response.data.detail;
          
          if (typeof detail === 'string') {
            if (detail.toLowerCase().includes('email')) {
              setErrors({ email: 'Este email ya está registrado' });
            } else if (detail.toLowerCase().includes('confirmation')) {
              setErrors({ 
                general: 'Usuario creado. Revisa tu email para confirmar tu cuenta.' 
              });
            } else {
              setErrors({ general: detail });
            }
          } else {
            setErrors({ general: 'Error al registrar usuario' });
          }
        } else if (error.request) {
          setErrors({ 
            general: 'No se pudo conectar con el servidor. Verifica que tu backend esté corriendo en http://localhost:8000' 
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

  const text = authTexts.register;

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
        label={text.nameLabel}
        type="text"
        name="fullName"
        placeholder={text.namePlaceholder}
        value={formData.fullName}
        onChange={handleChange}
        error={errors.fullName}
        disabled={loading}
        required
      />

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

      <InputField
        label="Teléfono"
        type="tel"
        name="phone"
        placeholder="+504 9999-9999"
        value={formData.phone}
        onChange={handleChange}
        error={errors.phone}
        disabled={loading}
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

      <PasswordInput
        label={text.confirmPasswordLabel}
        name="confirmPassword"
        placeholder={text.confirmPasswordPlaceholder}
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
        disabled={loading}
        required
      />

      <button 
        type="submit" 
        className="auth-button"
        disabled={loading}
        style={loading ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
      >
        {loading ? 'Registrando...' : text.submitButton}
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

export default RegisterForm;