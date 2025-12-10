// src/components/sections/HowItWorksSection.jsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import StepCard from '../ui/StepCard';
import { steps } from '../../constants/data';

const HowItWorksSection = () => {
  return (
    <section className="py-5" style={{ background: '#f8f9fa' }}>
      <Container>
        <div className="text-center mb-5">
          <h2 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '800', 
            marginBottom: '15px' 
          }}>
            Cómo funciona CronoPlan
          </h2>
          <p style={{ 
            fontSize: '1.1rem', 
            color: '#666', 
            maxWidth: '600px', 
            margin: '0 auto' 
          }}>
            Tres simples pasos para comenzar a organizar tu vida
          </p>
        </div>

        <Row className="g-4">
          {steps.map((step) => (
            <Col key={step.number} lg={4} md={12}>
              <StepCard 
                number={step.number}
                title={step.title}
                description={step.description}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default HowItWorksSection;