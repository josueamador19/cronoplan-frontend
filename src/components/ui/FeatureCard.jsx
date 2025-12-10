// src/components/ui/FeatureCard.jsx
import React from 'react';
import { Card } from 'react-bootstrap';

const FeatureCard = ({ icon, iconBg, title, description }) => {
  return (
    <Card className="feature-card">
      <Card.Body className="text-center">
        <div 
          className="feature-icon" 
          style={{ backgroundColor: iconBg }}
        >
          <span style={{ fontSize: '28px' }}>{icon}</span>
        </div>
        <h3 className="feature-title">{title}</h3>
        <p className="feature-description">{description}</p>
      </Card.Body>
    </Card>
  );
};

export default FeatureCard;