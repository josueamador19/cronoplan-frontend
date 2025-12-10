// src/components/auth/LoginForm.jsx
import React, { useState } from 'react';
import InputField from '../ui/InputField';
import PasswordInput from '../ui/PasswordInput';
import GoogleButton from './GoogleButton';
import AuthFooter from './AuthFooter';
import { authTexts } from '../../constants/authData';
import { FaArrowRight } from 'react-icons/fa';

const LoginForm = ({ onSubmit, onGoogleLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

  const text = authTexts.login;

  return (
    <form onSubmit={handleSubmit}>
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

      <div className="forgot-password">
        <a href="#forgot" className="auth-link">
          {text.forgotPassword}
        </a>
      </div>

      <button type="submit" className="auth-button">
        {text.submitButton}
        <FaArrowRight />
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

export default LoginForm;