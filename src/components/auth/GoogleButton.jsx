// src/components/auth/GoogleButton.jsx
import React from 'react';
import { FaGoogle } from 'react-icons/fa';

const GoogleButton = ({ onClick, text = 'Continuar con Google' }) => {
  return (
    <button 
      type="button"
      className="google-button" 
      onClick={onClick}
    >
      <FaGoogle className="google-icon" />
      {text}
    </button>
  );
};

export default GoogleButton;