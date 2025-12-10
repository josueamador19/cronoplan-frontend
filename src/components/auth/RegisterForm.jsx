// src/components/auth/RegisterForm.jsx
import React, { useState } from 'react';
import InputField from '../ui/InputField';
import PasswordInput from '../ui/PasswordInput';
import GoogleButton from './GoogleButton';
import AuthFooter from './AuthFooter';
import { authTexts } from '../../constants/authData';

const RegisterForm = ({ onSubmit, onGoogleLogin }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

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
    
    if (!formData.fullName) {
      newErrors.fullName = 'El nombre completo es requerido';
    } else if (formData.fullName.length < 3) {
      newErrors.fullName = 'El nombre debe tener al menos 3 caracteres';
    }
    
    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Ingresa un correo electrónico válido';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Debes confirmar tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    } else {
      setErrors(newErrors);
    }
  };

  const text = authTexts.register;

  return (
    <form onSubmit={handleSubmit}>
      <InputField
        label={text.nameLabel}
        type="text"
        name="fullName"
        placeholder={text.namePlaceholder}
        value={formData.fullName}
        onChange={handleChange}
        error={errors.fullName}
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
        required
      />

      <PasswordInput
        label={text.passwordLabel}
        name="password"
        placeholder={text.passwordPlaceholder}
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        required
      />

      <PasswordInput
        label={text.confirmPasswordLabel}
        name="confirmPassword"
        placeholder={text.confirmPasswordPlaceholder}
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
        required
      />

      <button type="submit" className="auth-button">
        {text.submitButton}
      </button>

      <div className="separator">{text.separator}</div>

    <GoogleButton 
        onClick={onGoogleLogin}
        text={text.googleButton}
      />
      
      <AuthFooter text={text} />
    </form>
  );
};

export default RegisterForm;