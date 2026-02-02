import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'

const ViewerPage = () => {
  const { id } = useParams()
  const [viewMode, setViewMode] = useState('3d') // 3d, 360, plan

  // Datos de ejemplo del proyecto
  const project = {
    id: id,
    name: 'Casa Ejemplo',
    date: '2026-02-01',
    images: 24,
    scans: 2
  }

  return (
    <div className="viewer-page" style={{ height: 'calc(100vh - 70px)' }}>
      {/* Header Info */}
      <div style={{ 
        background: 'var(--bg-primary)', 
        padding: '15px 20px',
        borderBottom: '1px solid var(--bg-tertiary)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link to="/projects" style={{ 
            textDecoration: 'none', 
            fontSize: '1.2rem',
            color: 'var(--primary-color)'
          }}>
            ← Volver
          </Link>
          <div>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '4px' }}>{project.name}</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>
              {project.date} • {project.images} imágenes • {project.scans} escaneos
            </p>
          </div>
        </div>

        {/* View Mode Selector */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setViewMode('3d')}
            className={`btn ${viewMode === '3d' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '8px 16px' }}
          >
            📐 Vista 3D
          </button>
          <button
            onClick={() => setViewMode('360')}
            className={`btn ${viewMode === '360' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '8px 16px' }}
          >
            🌐 Vista 360°
          </button>
          <button
            onClick={() => setViewMode('plan')}
            className={`btn ${viewMode === 'plan' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '8px 16px' }}
          >
            🗺️ Plano
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary">
            📥 Descargar
          </button>
          <button className="btn btn-primary">
            📤 Exportar
          </button>
        </div>
      </div>

      {/* Viewer Container */}
      <div className="viewer-container">
        {viewMode === '3d' && (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)'
          }}>
            <div style={{ fontSize: '5rem', marginBottom: '20px' }}>🏗️</div>
            <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '10px' }}>
              Visor 3D
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '20px' }}>
              Visualización interactiva del modelo 3D (Requiere Three.js)
            </p>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
              Características: Rotación, Zoom, Mediciones, Anotaciones
            </div>
          </div>
        )}

        {viewMode === '360' && (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)'
          }}>
            <div style={{ fontSize: '5rem', marginBottom: '20px' }}>🌐</div>
            <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '10px' }}>
              Visor 360°
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '20px' }}>
              Recorrido virtual inmersivo (Requiere Pannellum)
            </p>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
              Navega arrastrando o con el mouse • Usa WASD para moverte
            </div>
          </div>
        )}

        {viewMode === 'plan' && (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}>
            <div style={{ fontSize: '5rem', marginBottom: '20px' }}>🗺️</div>
            <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '10px' }}>
              Vista de Plano
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '20px' }}>
              Planos 2D generados automáticamente
            </p>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
              Exporta a: DWG, DXF, PDF, PNG
            </div>
          </div>
        )}

        {/* Viewer Controls */}
        <div className="viewer-controls">
          <button title="Zoom In">🔍+</button>
          <button title="Zoom Out">🔍-</button>
          <button title="Reset View">🔄</button>
          <button title="Fullscreen">⛶</button>
          <button title="Settings">⚙️</button>
        </div>
      </div>
    </div>
  )
}

export default ViewerPage
