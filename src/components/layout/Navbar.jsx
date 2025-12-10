// src/components/layout/Navbar.jsx
import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { navLinks } from '../../constants/data';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

const NavigationBar = () => {
  const navigate = useNavigate();
  return (
    <Navbar bg="light" expand="lg" className="py-3" sticky="top">
      <Container>
        <Navbar.Brand href="/" className="d-flex align-items-center">
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
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            {navLinks.map((link, index) => (
              <Nav.Link 
                key={index} 
                href={link.path}
                className="px-3"
                style={{ fontWeight: '500' }}
              >
                {link.name}
              </Nav.Link>
            ))}
          </Nav>
          
          <div className="d-flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
              Iniciar sesión
            </Button>
            <Button variant="primary" size="sm" onClick={() => navigate('/register')}>
              Comenzar gratis
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;