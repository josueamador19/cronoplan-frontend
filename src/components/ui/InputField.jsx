// src/components/ui/InputField.jsx
import React from 'react';

const InputField = ({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  error,
  name,
  required = false
}) => {
  return (
    <div className="input-group-custom">
      {label && (
        <label className="input-label" htmlFor={name}>
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        className={`input-field ${error ? 'input-error' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default InputField;