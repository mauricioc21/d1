import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { useAuth } from '../contexts/AuthContext'

export const AUTH_BRAND_HIGHLIGHTS = [
  {
    icon: '🌀',
    title: 'Captura 360°',
    description: 'Trabaja con cámaras 360° o desde tu smartphone para recorridos inmersivos.',
  },
  {
    icon: '📐',
    title: 'Planos precisos',
    description: 'Genera planos 2D y modelos 3D listos para CAD/BIM con medidas fiables.',
  },
  {
    icon: '☁️',
    title: 'Sincronización total',
    description: 'Gestión centralizada en la nube con acceso seguro desde web y app móvil.',
  },
]

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, resetPassword } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [statusMessage, setStatusMessage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fromPath = location.state?.from?.pathname || '/projects'

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    setStatusMessage(null)

    if (!email || !password) {
      setError('Por favor, ingresa tu correo y contraseña.')
      return
    }

    try {
      setIsSubmitting(true)
      await login(email, password)
      navigate(fromPath, { replace: true })
    } catch (err) {
      console.error('Error iniciando sesión', err)
      let message = 'No se pudo iniciar sesión. Verifica tus datos.'

      switch (err.code) {
        case 'auth/user-not-found':
          message = 'No encontramos una cuenta con ese correo.'
          break
        case 'auth/wrong-password':
          message = 'Contraseña incorrecta. Intenta nuevamente.'
          break
        case 'auth/too-many-requests':
          message = 'Demasiados intentos. Inténtalo de nuevo más tarde.'
          break
        default:
          break
      }

      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResetPassword = async () => {
    if (!email) {
      setError('Ingresa tu correo para enviar el enlace de recuperación.')
      return
    }

    try {
      setError(null)
      await resetPassword(email)
      setStatusMessage('Hemos enviado un correo para que puedas restablecer tu contraseña.')
    } catch (err) {
      console.error('Error enviando restablecimiento de contraseña', err)
      setError('No pudimos enviar el enlace. Verifica el correo e inténtalo nuevamente.')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <aside className="auth-panel auth-brand-panel">
          <div className="auth-brand">
            <img src="/logo-d1.png" alt="Logo Su Todero D1" className="auth-logo" />
            <h1 className="auth-title">Su Todero D1</h1>
            <p className="auth-tagline">
              Escaneo 3D profesional y captura 360° sobre un lienzo oscuro elegante, sin fondos blancos
              que distraigan la experiencia premium de la marca.
            </p>

            <ul className="auth-highlight-list">
              {AUTH_BRAND_HIGHLIGHTS.map((item) => (
                <li key={item.title} className="auth-highlight-item">
                  <span className="auth-highlight-icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <section className="auth-panel auth-form-panel">
          <header className="auth-form-header">
            <span className="auth-form-kicker">Acceso seguro</span>
            <h2>Inicia sesión</h2>
            <p>Gestiona capturas, recorridos virtuales e inventarios sin salir de la oficina.</p>
          </header>

          <form onSubmit={handleSubmit} className="auth-form">
            <label className="auth-label">
              Correo electrónico
              <input
                type="email"
                placeholder="tu-correo@ejemplo.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={isSubmitting}
                required
              />
            </label>

            <label className="auth-label">
              Contraseña
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={isSubmitting}
                required
              />
            </label>

            {error && (
              <div className="auth-error" role="alert">
                {error}
              </div>
            )}

            {statusMessage && (
              <div className="auth-status" role="status">
                {statusMessage}
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>

          <div className="auth-links auth-links-left">
            <button
              type="button"
              className="link-button"
              onClick={handleResetPassword}
              disabled={isSubmitting}
            >
              ¿Olvidaste tu contraseña?
            </button>
            <span>
              ¿Aún no tienes cuenta?{' '}
              <Link to="/register" className="link">
                Crear cuenta
              </Link>
            </span>
          </div>
        </section>
      </div>
    </div>
  )
}

export default LoginPage
