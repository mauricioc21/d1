import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { useAuth } from '../contexts/AuthContext'

const RequireAuth = ({ children }) => {
  const location = useLocation()
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="fullpage-loader">
        <div className="spinner-large" />
        <p style={{ marginTop: 16, color: 'var(--text-secondary)' }}>Verificando acceso...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default RequireAuth
