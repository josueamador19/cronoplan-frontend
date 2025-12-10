// src/components/auth/AuthFooter.jsx
import React from 'react';

const AuthFooter = ({ text }) => {
  return (
    <div className="auth-footer-text">
      {text.footerText}{' '}
      <a href="#terminos">{text.terms}</a> {text.and}{' '}
      <a href="#privacidad">{text.privacy}</a>
    </div>
  );
};

export default AuthFooter;