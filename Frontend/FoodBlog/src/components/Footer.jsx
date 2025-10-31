import React from 'react';
import './Footer.css'; 
import logo from '../assets/logo.jpg';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <img src={logo} alt="Logo" className="footer-logo-img" />
        </div>
        <ul className="footer-links">
          <li><a href="#">Privacy</a></li>
          <li><a href="#">Terms</a></li>
          <li><a href="#">Support</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
        <div className="footer-social">
          <a href="#"><span>🔗</span></a>
          <a href="#"><span>📘</span></a>
          <a href="#"><span>🐦</span></a>
        </div>
      </div>
      <div className="footer-bottom">
        © {new Date().getFullYear()} MyCompany. All rights reserved.
      </div>
    </footer>
  );
};
