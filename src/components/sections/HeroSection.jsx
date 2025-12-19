// src/components/sections/HeroSection.jsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';
const HeroSection = () => {
   const navigate = useNavigate();
  return (
    <section className="hero-section">
      <Container>
        <Row className="align-items-center">
          <Col lg={6} className="mb-5 mb-lg-0">
            <p style={{ color: '#5B68F5', fontWeight: '600', marginBottom: '15px' }}>
              🚀 Curso integrado en con Capacitación 2.0
            </p>
            <h1 className="hero-title">
              Organiza tu tiempo.
            </h1>
            <h1 className="hero-subtitle">
              Domina tus actividades.
            </h1>
            <p className="hero-description">
              CronoPlan te ayuda a priorizar tareas, tableros, recordatorios inteligentes y más. La herramienta definitiva para equipos ágiles y personas productivas.
            </p>
            
            <div className="d-flex gap-3 mb-3">
              <Button variant="primary" size="lg" onClick={() => navigate('/register')}>
                Comenzar gratis
              </Button>
              <Button variant="outline" size="lg">
                Ver características
              </Button>
            </div>
          </Col>

          <Col lg={6}>
            <div 
              style={{
                background: 'white',
                borderRadius: '20px',
                padding: '30px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                position: 'relative'
              }}
            >
              {/* Mockup simplificado del tablero */}
              <div className="mb-3">
                <h5 style={{ fontWeight: '700', marginBottom: '20px' }}>
                  📋 Tablero de Proyecto
                </h5>
              </div>

              <Row>
                {/* Columna Por hacer */}
                <Col md={4} className="mb-3">
                  <div style={{ 
                    background: '#f8f9fa', 
                    padding: '15px', 
                    borderRadius: '10px' 
                  }}>
                    <p style={{ 
                      fontWeight: '600', 
                      fontSize: '0.85rem', 
                      color: '#666',
                      marginBottom: '10px' 
                    }}>
                      Por hacer
                    </p>
                    <div style={{ 
                      background: 'white', 
                      padding: '10px', 
                      borderRadius: '8px',
                      marginBottom: '8px',
                      borderLeft: '3px solid #5B68F5'
                    }}>
                      <p style={{ fontSize: '0.85rem', margin: 0, fontWeight: '500' }}>
                        Diseñar UI
                      </p>
                    </div>
                    <div style={{ 
                      background: 'white', 
                      padding: '10px', 
                      borderRadius: '8px',
                      borderLeft: '3px solid #5B68F5'
                    }}>
                      <p style={{ fontSize: '0.85rem', margin: 0, fontWeight: '500' }}>
                        Mensajes
                      </p>
                    </div>
                  </div>
                </Col>

                {/* Columna En progreso */}
                <Col md={4} className="mb-3">
                  <div style={{ 
                    background: '#f8f9fa', 
                    padding: '15px', 
                    borderRadius: '10px' 
                  }}>
                    <p style={{ 
                      fontWeight: '600', 
                      fontSize: '0.85rem', 
                      color: '#666',
                      marginBottom: '10px' 
                    }}>
                      En progreso
                    </p>
                    <div style={{ 
                      background: 'white', 
                      padding: '10px', 
                      borderRadius: '8px',
                      borderLeft: '3px solid #FFC107'
                    }}>
                      <p style={{ fontSize: '0.85rem', margin: 0, fontWeight: '500' }}>
                        Crear landing page
                      </p>
                    </div>
                  </div>
                </Col>

                {/* Columna Completado */}
                <Col md={4} className="mb-3">
                  <div style={{ 
                    background: '#f8f9fa', 
                    padding: '15px', 
                    borderRadius: '10px' 
                  }}>
                    <p style={{ 
                      fontWeight: '600', 
                      fontSize: '0.85rem', 
                      color: '#666',
                      marginBottom: '10px' 
                    }}>
                      Completado
                    </p>
                    <div style={{ 
                      background: 'white', 
                      padding: '10px', 
                      borderRadius: '8px',
                      borderLeft: '3px solid #28A745'
                    }}>
                      <p style={{ fontSize: '0.85rem', margin: 0, fontWeight: '500' }}>
                        Investigación de usuario
                      </p>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default HeroSection;