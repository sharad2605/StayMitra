import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Footer.css'; // For custom styling if needed

const Footer = () => {
  return (
    <footer className="footer bg-dark text-white py-4">
      <Container>
        <Row>
          <Col md={4}>
            <h5>StayMitra</h5>
            <p>Connect with your community.</p>
          </Col>
          <Col md={4}>
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-white">Home</a></li>
              <li><a href="#about" className="text-white">About</a></li>
              <li><a href="#contact" className="text-white">Contact</a></li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Follow Us</h5>
            <ul className="list-unstyled">
              <li><a href="https://facebook.com" className="text-white">Facebook</a></li>
              <li><a href="https://twitter.com" className="text-white">Twitter</a></li>
              <li><a href="https://instagram.com" className="text-white">Instagram</a></li>
            </ul>
          </Col>
        </Row>
        <Row>
          <Col className="text-center mt-4">
            <p>&copy; 2025 StayMitra by Sharad Shukla.<br /> All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
