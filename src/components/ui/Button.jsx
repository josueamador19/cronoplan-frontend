// src/components/ui/Button.jsx
import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  className = '',
  ...props 
}) => {
  const getButtonClass = () => {
    const baseClass = 'btn';
    const variantClass = variant === 'primary' 
      ? 'btn-primary-custom' 
      : variant === 'outline' 
      ? 'btn-outline-custom' 
      : 'btn-link';
    
    const sizeClass = size === 'lg' 
      ? 'btn-lg' 
      : size === 'sm' 
      ? 'btn-sm' 
      : '';

    return `${baseClass} ${variantClass} ${sizeClass} ${className}`.trim();
  };

  return (
    <button 
      className={getButtonClass()} 
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;