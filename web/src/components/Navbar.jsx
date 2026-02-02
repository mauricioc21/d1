import React from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">📐</span>
          <span className="logo-text">Su Todero D1</span>
        </Link>
        
        <ul className="navbar-menu">
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/projects">Proyectos</Link></li>
          <li><Link to="/upload">Subir</Link></li>
          <li>
            <a href="#features">Características</a>
          </li>
        </ul>
        
        <div className="navbar-actions">
          <button className="btn btn-secondary">Iniciar Sesión</button>
          <button className="btn btn-primary">Comenzar</button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
