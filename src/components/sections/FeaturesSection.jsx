// src/components/sections/FeaturesSection.jsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import FeatureCard from '../ui/FeatureCard';
import { features } from '../../constants/data';

const FeaturesSection = () => {
  return (
    <section className="py-5" style={{ background: '#fff' }} id="funciones">
      <Container>
        <div className="text-center mb-5">
          <h2 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '800', 
            marginBottom: '15px' 
          }}>
            Todo lo que necesitas para fluir
          </h2>
          <p style={{ 
            fontSize: '1.1rem', 
            color: '#666', 
            maxWidth: '600px', 
            margin: '0 auto' 
          }}>
            Herramientas poderosas que te ayudarán a crear tableros únicos y elegantes
          </p>
        </div>

        <Row className="g-4">
          {features.map((feature) => (
            <Col key={feature.id} lg={3} md={6}>
              <FeatureCard 
                icon={feature.icon}
                iconBg={feature.iconBg}
                title={feature.title}
                description={feature.description}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default FeaturesSection;