import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../contexts/AuthContext'

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
        default:
          break
      }

      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="container" style={{ maxWidth: 520 }}>
        <div className="card" style={{ padding: '32px 28px' }}>
          <h1 style={{ marginBottom: 12, textAlign: 'center' }}>Crea tu cuenta</h1>
          <p style={{ marginBottom: 24, textAlign: 'center', color: 'var(--text-secondary)' }}>
            Configura tu perfil para comenzar a capturar espacios y generar planos inteligentes
          </p>

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

          <div className="auth-links">
            <span>
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="link">
                Inicia sesión aquí
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
