// src/components/sections/ViewsSection.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';

const ViewsSection = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderView = () => {
    switch(activeTab) {
      case 'dashboard':
        return (
          <div style={{ 
            background: 'white', 
            padding: '40px', 
            borderRadius: '16px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
          }}>
            <h4 style={{ fontWeight: '700', marginBottom: '20px' }}>
              Vista Dashboard
            </h4>
            <Row>
              <Col md={4}>
                <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '10px', height: '200px' }}>
                  <p style={{ fontWeight: '600', color: '#666' }}>Por hacer</p>
                  <div style={{ background: 'white', padding: '10px', borderRadius: '8px', marginTop: '10px' }}>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>Tarea 1</p>
                  </div>
                </div>
              </Col>
              <Col md={4}>
                <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '10px', height: '200px' }}>
                  <p style={{ fontWeight: '600', color: '#666' }}>En progreso</p>
                  <div style={{ background: 'white', padding: '10px', borderRadius: '8px', marginTop: '10px' }}>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>Tarea 2</p>
                  </div>
                </div>
              </Col>
              <Col md={4}>
                <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '10px', height: '200px' }}>
                  <p style={{ fontWeight: '600', color: '#666' }}>Completado</p>
                  <div style={{ background: 'white', padding: '10px', borderRadius: '8px', marginTop: '10px' }}>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>Tarea 3</p>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        );
      case 'calendario':
        return (
          <div style={{ 
            background: 'white', 
            padding: '40px', 
            borderRadius: '16px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h4 style={{ fontWeight: '700', marginBottom: '20px' }}>
              Vista Calendario
            </h4>
            <div style={{ 
              background: '#f8f9fa', 
              padding: '40px', 
              borderRadius: '10px',
              height: '300px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <p style={{ fontSize: '3rem' }}>📅</p>
            </div>
          </div>
        );
      case 'tareas':
        return (
          <div style={{ 
            background: 'white', 
            padding: '40px', 
            borderRadius: '16px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
          }}>
            <h4 style={{ fontWeight: '700', marginBottom: '20px' }}>
              Planificación Mensual
            </h4>
            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '10px' }}>
              {[1,2,3,4].map((item) => (
                <div key={item} style={{ 
                  background: 'white', 
                  padding: '15px', 
                  borderRadius: '8px',
                  marginBottom: '10px',
                  borderLeft: '4px solid #5B68F5'
                }}>
                  <p style={{ margin: 0, fontWeight: '500' }}>Tarea {item}</p>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section className="py-5" style={{ background: '#fff' }}>
      <Container>
        <div className="text-center mb-5">
          <h2 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '800', 
            marginBottom: '15px' 
          }}>
            Diseñado para la claridad
          </h2>
          <p style={{ 
            fontSize: '1.1rem', 
            color: '#666', 
            maxWidth: '600px', 
            margin: '0 auto' 
          }}>
            Explora las diferentes vistas que optimizan tus proyectos visuales
          </p>
        </div>

        <Row className="justify-content-center mb-4">
          <Col lg={8}>
            <Nav 
              variant="pills" 
              className="justify-content-center gap-3"
              style={{ background: '#f8f9fa', padding: '10px', borderRadius: '12px' }}
            >
              <Nav.Item>
                <Nav.Link 
                  active={activeTab === 'dashboard'}
                  onClick={() => setActiveTab('dashboard')}
                  style={{
                    background: activeTab === 'dashboard' ? '#5B68F5' : 'transparent',
                    color: activeTab === 'dashboard' ? 'white' : '#666',
                    fontWeight: '600',
                    borderRadius: '8px'
                  }}
                >
                  Dashboard
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link 
                  active={activeTab === 'calendario'}
                  onClick={() => setActiveTab('calendario')}
                  style={{
                    background: activeTab === 'calendario' ? '#5B68F5' : 'transparent',
                    color: activeTab === 'calendario' ? 'white' : '#666',
                    fontWeight: '600',
                    borderRadius: '8px'
                  }}
                >
                  Calendario
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link 
                  active={activeTab === 'tareas'}
                  onClick={() => setActiveTab('tareas')}
                  style={{
                    background: activeTab === 'tareas' ? '#5B68F5' : 'transparent',
                    color: activeTab === 'tareas' ? 'white' : '#666',
                    fontWeight: '600',
                    borderRadius: '8px'
                  }}
                >
                  Tareas
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col lg={10}>
            {renderView()}
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ViewsSection;