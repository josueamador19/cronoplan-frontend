
import React from 'react';

const AuthTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="auth-tabs">
      <button
        className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
        onClick={() => onTabChange('login')}
      >
        Iniciar sesión
      </button>
      <button
        className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
        onClick={() => onTabChange('register')}
      >
        Crear cuenta
      </button>
    </div>
  );
};

export default AuthTabs;