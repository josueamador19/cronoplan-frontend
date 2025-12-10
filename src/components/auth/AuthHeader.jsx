// src/components/auth/AuthHeader.jsx
import React from 'react';
import { FaClock } from 'react-icons/fa';

const AuthHeader = ({ title, subtitle }) => {
  return (
    <div>
      <div className="auth-logo">
        <FaClock />
      </div>
      <h1 className="auth-title">{title}</h1>
      <p className="auth-subtitle">{subtitle}</p>
    </div>
  );
};

export default AuthHeader;