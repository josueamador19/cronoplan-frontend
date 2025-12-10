// src/components/ui/PasswordInput.jsx
import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const PasswordInput = ({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  error,
  name,
  required = false
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="input-group-custom">
      {label && (
        <label className="input-label" htmlFor={name}>
          {label}
        </label>
      )}
      <div className="password-wrapper">
        <input
          id={name}
          name={name}
          type={showPassword ? 'text' : 'password'}
          className={`input-field ${error ? 'input-error' : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
        />
        <button
          type="button"
          className="password-toggle"
          onClick={togglePasswordVisibility}
          tabIndex={-1}
        >
          {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default PasswordInput;