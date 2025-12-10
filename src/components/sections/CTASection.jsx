// src/components/sections/CTASection.jsx
import React from 'react';
import { Container } from 'react-bootstrap';
import Button from '../ui/Button';

const CTASection = () => {
  return (
    <section className="py-5" style={{ background: '#fff' }}>
      <Container>
        <div className="cta-section">
          <h2 className="cta-title">
            ¿Listo para tomar el control?
          </h2>
          <p className="cta-subtitle">
            Únete a más de 10,000 usuarios que ya organizan su vida con CronoPlan
          </p>
          
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Button 
              variant="outline" 
              size="lg"
              style={{ 
                background: 'white', 
                color: '#5B68F5',
                border: '2px solid white'
              }}
            >
              Comenzar gratis
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              style={{ 
                borderColor: 'white',
                color: 'white'
              }}
            >
              Agendar demo
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CTASection;