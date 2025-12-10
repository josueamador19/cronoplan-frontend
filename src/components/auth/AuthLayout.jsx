// src/components/auth/AuthLayout.jsx
import React from 'react';
import '../../styles/auth.css';

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-container">
      <div className="auth-circle"></div>
      <div className="auth-card">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;