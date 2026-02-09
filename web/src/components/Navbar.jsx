import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Navbar.css'

import { useAuth } from '../contexts/AuthContext'

const Navbar = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout, loading } = useAuth()

  const handleLogin = () => navigate('/login')
  const handleRegister = () => navigate('/register')
  const handlePrimary = () => navigate(isAuthenticated ? '/upload' : '/register')

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/', { replace: true })
    } catch (error) {
      console.error('Error cerrando sesión', error)
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img
            src="/logo-d1.png"
            alt="Su Todero D1"
            className="logo-image"
          />
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
          {isAuthenticated ? (
            <>
              <div className="navbar-user">
                <span className="navbar-user-avatar">{user?.displayName?.[0] || user?.email?.[0] || '👤'}</span>
                <div className="navbar-user-info">
                  <span className="navbar-user-name">{user?.displayName || user?.email}</span>
                  <span className="navbar-user-role">Operador</span>
                </div>
              </div>
              <button className="btn btn-secondary" onClick={handleLogout} disabled={loading}>
                Cerrar sesión
              </button>
              <button className="btn btn-primary" onClick={handlePrimary}>
                Nuevo proyecto
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-primary" onClick={handleLogin} disabled={loading}>
                Iniciar sesión
              </button>
              <button className="btn btn-primary" onClick={handleRegister}>
                Crear cuenta
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
