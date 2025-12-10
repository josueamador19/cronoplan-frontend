// src/components/layout/Footer.jsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';
import { footerLinks } from '../../constants/data';

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row>
          {/* Logo y descripción */}
          <Col lg={4} md={6} className="mb-4">
            <div className="d-flex align-items-center mb-3">
              <div 
                style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#5B68F5',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '10px',
                  color: 'white',
                  fontWeight: 'bold'
                }}
              >
                C
              </div>
              <span style={{ fontWeight: '700', fontSize: '1.2rem' }}>CronoPlan</span>
            </div>
            <p style={{ color: '#999', fontSize: '0.9rem' }}>
              La herramienta definitiva para organizar tu tiempo, tareas y proyectos. Simple, intuitiva y poderosa.
            </p>
          </Col>

          {/* Producto */}
          <Col lg={2} md={6} className="mb-4">
            <h5 className="footer-title">Producto</h5>
            {footerLinks.producto.map((link, index) => (
              <a key={index} href={link.path} className="footer-link">
                {link.name}
              </a>
            ))}
          </Col>

          {/* Recursos */}
          <Col lg={2} md={6} className="mb-4">
            <h5 className="footer-title">Recursos</h5>
            {footerLinks.recursos.map((link, index) => (
              <a key={index} href={link.path} className="footer-link">
                {link.name}
              </a>
            ))}
          </Col>

          {/* Compañía */}
          <Col lg={2} md={6} className="mb-4">
            <h5 className="footer-title">Compañía</h5>
            {footerLinks.compania.map((link, index) => (
              <a key={index} href={link.path} className="footer-link">
                {link.name}
              </a>
            ))}
          </Col>

          {/* Redes sociales */}
          <Col lg={2} md={12} className="mb-4">
            <h5 className="footer-title">Síguenos</h5>
            <div className="d-flex gap-3">
              <a 
                href="#" 
                style={{ color: '#999', fontSize: '1.5rem', transition: 'color 0.3s' }}
                onMouseEnter={(e) => e.target.style.color = '#5B68F5'}
                onMouseLeave={(e) => e.target.style.color = '#999'}
              >
                <FaTwitter />
              </a>
              <a 
                href="#" 
                style={{ color: '#999', fontSize: '1.5rem', transition: 'color 0.3s' }}
                onMouseEnter={(e) => e.target.style.color = '#5B68F5'}
                onMouseLeave={(e) => e.target.style.color = '#999'}
              >
                <FaLinkedin />
              </a>
              <a 
                href="#" 
                style={{ color: '#999', fontSize: '1.5rem', transition: 'color 0.3s' }}
                onMouseEnter={(e) => e.target.style.color = '#5B68F5'}
                onMouseLeave={(e) => e.target.style.color = '#999'}
              >
                <FaGithub />
              </a>
            </div>
          </Col>
        </Row>

        {/* Copyright */}
        <Row className="mt-4 pt-4" style={{ borderTop: '1px solid #333' }}>
          <Col className="text-center">
            <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
              © 2024 CronoPlan Inc. Todos los derechos reservados.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;