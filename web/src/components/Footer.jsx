import React from 'react'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Su Todero D1</h3>
          <p>Escaneo 3D profesional y captura 360° para todos</p>
        </div>
        
        <div className="footer-section">
          <h4>Producto</h4>
          <ul>
            <li><a href="#features">Características</a></li>
            <li><a href="#pricing">Precios</a></li>
            <li><a href="#docs">Documentación</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Soporte</h4>
          <ul>
            <li><a href="#help">Centro de Ayuda</a></li>
            <li><a href="#tutorials">Tutoriales</a></li>
            <li><a href="#contact">Contacto</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Empresa</h4>
          <ul>
            <li><a href="#about">Acerca de</a></li>
            <li><a href="#blog">Blog</a></li>
            <li><a href="#careers">Careers</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© 2026 Su Todero D1. Todos los derechos reservados.</p>
        <div className="footer-links">
          <a href="#privacy">Privacidad</a>
          <a href="#terms">Términos</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
