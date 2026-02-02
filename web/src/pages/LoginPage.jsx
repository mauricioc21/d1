import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { useAuth } from '../contexts/AuthContext'

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
      <div className="container" style={{ maxWidth: 480 }}>
        <div className="card" style={{ padding: '32px 28px' }}>
          <h1 style={{ marginBottom: 12, textAlign: 'center' }}>Bienvenido de nuevo</h1>
          <p style={{ marginBottom: 24, textAlign: 'center', color: 'var(--text-secondary)' }}>
            Inicia sesión para gestionar tus proyectos y capturas 3D
          </p>

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
              {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="auth-links">
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
        </div>
      </div>
    </div>
  )
}

export default LoginPage
