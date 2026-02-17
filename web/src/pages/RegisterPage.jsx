import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../contexts/AuthContext'
import { AUTH_BRAND_HIGHLIGHTS } from './LoginPage'

const RegisterPage = () => {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden. Inténtalo nuevamente.')
      return
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }

    try {
      setIsSubmitting(true)
      await register({ email, password, displayName })
      navigate('/projects', { replace: true })
    } catch (err) {
      console.error('Error creando cuenta', err)
      let message = 'No pudimos crear tu cuenta. Intenta nuevamente.'

      switch (err.code) {
        case 'auth/email-already-in-use':
          message = 'Ya existe una cuenta con ese correo.'
          break
        case 'auth/invalid-email':
          message = 'El correo ingresado no es válido.'
          break
        case 'auth/weak-password':
          message = 'La contraseña es muy débil. Intenta con otra.'
          break
        case 'auth/operation-not-allowed':
          message =
            'El registro por correo no está habilitado. Activa Email/Contraseña en Firebase Authentication.'
          break
        case 'auth/network-request-failed':
          message = 'No hay conexión con el servidor. Verifica tu red e inténtalo de nuevo.'
          break
        default:
          if (err.message) {
            message = err.message
          }
          break
      }

      setError(message)
    } finally {
      setIsSubmitting(false)
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
              Crea tu cuenta para comenzar a capturar espacios, generar recorridos virtuales y planificar
              proyectos sin salir de tu oficina.
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
            <span className="auth-form-kicker">Comienza ahora</span>
            <h2>Crea tu cuenta</h2>
            <p>Configura tu perfil para coordinar escaneos 3D y recorridos inmersivos al instante.</p>
          </header>

          <form onSubmit={handleSubmit} className="auth-form">
            <label className="auth-label">
              Nombre o alias
              <input
                type="text"
                placeholder="Mauricio Demo"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                disabled={isSubmitting}
              />
            </label>

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
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={isSubmitting}
                required
              />
            </label>

            <label className="auth-label">
              Confirmar contraseña
              <input
                type="password"
                placeholder="Repite tu contraseña"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                disabled={isSubmitting}
                required
              />
            </label>

            {error && (
              <div className="auth-error" role="alert">
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          <div className="auth-links auth-links-left">
            <span>
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="link">
                Inicia sesión aquí
              </Link>
            </span>
          </div>
        </section>
      </div>
    </div>
  )
}

export default RegisterPage
