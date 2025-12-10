// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import AuthLayout from '../components/auth/AuthLayout';
import AuthHeader from '../components/auth/AuthHeader';
import AuthTabs from '../components/auth/AuthTabs';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import { authTexts } from '../constants/authData';

const RegisterPage = () => {
  const [activeTab, setActiveTab] = useState('register');

  const handleLogin = (formData) => {
    console.log('Login data:', formData);
    // Aquí irá la lógica de autenticación con Supabase
    alert('Iniciando sesión...');
  };

  const handleRegister = (formData) => {
    console.log('Register data:', formData);
    // Aquí irá la lógica de registro con Supabase
    alert('Creando cuenta...');
  };

  const handleGoogleLogin = () => {
    console.log('Google login');
    // Aquí irá la lógica de autenticación con Google
    alert('Iniciando sesión con Google...');
  };

  const currentText = activeTab === 'login' ? authTexts.login : authTexts.register;

  return (
    <AuthLayout>
     <AuthHeader 
        title={currentText.title}
        subtitle={currentText.subtitle}
      />
      
      <AuthTabs 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'login' ? (
        <LoginForm 
          onSubmit={handleLogin}
          onGoogleLogin={handleGoogleLogin}
        />
      ) : (
        <RegisterForm 
          onSubmit={handleRegister}
          onGoogleLogin={handleGoogleLogin}
        />
      )}
    </AuthLayout>
  );
};

export default RegisterPage;