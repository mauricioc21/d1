import React, { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Pannellum } from 'pannellum-react'

import { getProjectById, listenCapturesByProject } from '../services/data'
import { CaptureType } from '@shared/data/constants'

const CAPTURE_LABELS = {
  [CaptureType.PHOTO]: 'Foto',
  [CaptureType.PHOTO_360]: '360°',
  [CaptureType.SCAN_3D]: 'Escaneo 3D',
  [CaptureType.VIDEO]: 'Video',
}

const formatDate = (value) => {
  if (!value) return 'Sin fecha'
  const date = value instanceof Date ? value : new Date(value)
  return date.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  })
}

const ViewerPage = () => {
  const { id } = useParams()
  const [viewMode, setViewMode] = useState('360')
  const [project, setProject] = useState(null)
  const [projectLoading, setProjectLoading] = useState(true)
  const [projectError, setProjectError] = useState(null)
  const [captures, setCaptures] = useState([])
  const [capturesLoading, setCapturesLoading] = useState(true)
  const [capturesError, setCapturesError] = useState(null)
  const [selectedCaptureId, setSelectedCaptureId] = useState(null)

  useEffect(() => {
    let isMounted = true
    setProjectLoading(true)
    setProjectError(null)

    getProjectById(id)
      .then((data) => {
        if (!isMounted) return
        setProject(data)
      })
      .catch((error) => {
        if (!isMounted) return
        setProjectError(error)
      })
      .finally(() => {
        if (!isMounted) return
        setProjectLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [id])

  useEffect(() => {
    setCapturesLoading(true)
    setCapturesError(null)

    const unsubscribe = listenCapturesByProject(
      id,
      (data) => {
        setCaptures(data)
        setCapturesLoading(false)
      },
      {
        onError: (error) => {
          setCapturesError(error)
          setCapturesLoading(false)
        },
      }
    )

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe()
      }
    }
  }, [id])

  const captureSummary = useMemo(() => {
    return captures.reduce(
      (acc, capture) => {
        acc[capture.type] = (acc[capture.type] || 0) + 1
        return acc
      },
      {
        [CaptureType.PHOTO]: 0,
        [CaptureType.PHOTO_360]: 0,
        [CaptureType.SCAN_3D]: 0,
        [CaptureType.VIDEO]: 0,
      }
    )
  }, [captures])

  const preferredCapture = useMemo(() => {
    if (!captures.length) return null
    if (viewMode === '360') {
      return (
        captures.find((capture) => capture.type === CaptureType.PHOTO_360) ||
        captures.find((capture) => capture.type === CaptureType.PHOTO)
      )
    }
    if (viewMode === '3d') {
      return captures.find((capture) => capture.type === CaptureType.SCAN_3D)
    }
    return captures.find((capture) => capture.type === CaptureType.PHOTO) || captures[0]
  }, [captures, viewMode])

  useEffect(() => {
    if (!captures.length) {
      setSelectedCaptureId(null)
      return
    }

    const current = captures.find((capture) => capture.id === selectedCaptureId)
    if (current) return

    const fallback = preferredCapture || captures[0]
    setSelectedCaptureId(fallback?.id || null)
  }, [captures, preferredCapture, selectedCaptureId])

  const selectedCapture = useMemo(() => {
    return captures.find((capture) => capture.id === selectedCaptureId) || null
  }, [captures, selectedCaptureId])

  const headerSubtitle = project
    ? `${formatDate(project.createdAt)} • ${project.metrics?.totalCaptures || 0} fotos • ${
        project.metrics?.totalScans || 0
      } escaneos • ${project.metrics?.total360 || 0} 360°`
    : ''

  return (
    <div className="viewer-page" style={{ minHeight: 'calc(100vh - 70px)' }}>
      <div className="viewer-header">
        <div className="viewer-header-left">
          <Link to="/projects" className="viewer-back">
            ← Volver
          </Link>
          <div>
            <h2>{project?.name || 'Proyecto'}</h2>
            {projectLoading ? (
              <p className="viewer-subtitle">Cargando proyecto...</p>
            ) : projectError ? (
              <p className="viewer-subtitle viewer-error">No pudimos cargar el proyecto.</p>
            ) : (
              <p className="viewer-subtitle">{headerSubtitle}</p>
            )}
          </div>
        </div>

        <div className="viewer-mode">
          <button
            onClick={() => setViewMode('3d')}
            className={`btn ${viewMode === '3d' ? 'btn-primary' : 'btn-secondary'}`}
          >
            📐 Vista 3D
          </button>
          <button
            onClick={() => setViewMode('360')}
            className={`btn ${viewMode === '360' ? 'btn-primary' : 'btn-secondary'}`}
          >
            🌐 Vista 360°
          </button>
          <button
            onClick={() => setViewMode('plan')}
            className={`btn ${viewMode === 'plan' ? 'btn-primary' : 'btn-secondary'}`}
          >
            🗺️ Plano
          </button>
        </div>

        <div className="viewer-actions">
          <button className="btn btn-secondary">📥 Descargar</button>
          <button className="btn btn-primary">📤 Exportar</button>
        </div>
      </div>

      <div className="viewer-body">
        <aside className="viewer-sidebar">
          <div className="viewer-sidebar-header">
            <h3>Capturas</h3>
            <span>{captures.length}</span>
          </div>

          <div className="viewer-summary">
            <div>
              <strong>{captureSummary[CaptureType.PHOTO_360] || 0}</strong>
              <span>360°</span>
            </div>
            <div>
              <strong>{captureSummary[CaptureType.PHOTO] || 0}</strong>
              <span>Fotos</span>
            </div>
            <div>
              <strong>{captureSummary[CaptureType.SCAN_3D] || 0}</strong>
              <span>3D</span>
            </div>
          </div>

          {capturesLoading ? (
            <p className="viewer-muted">Cargando capturas...</p>
          ) : capturesError ? (
            <div className="viewer-error-block">
              <p>No pudimos cargar las capturas.</p>
              <span>{capturesError.message}</span>
            </div>
          ) : captures.length === 0 ? (
            <p className="viewer-muted">Aún no hay capturas para este proyecto.</p>
          ) : (
            <div className="viewer-capture-list">
              {captures.map((capture) => {
                const isActive = capture.id === selectedCaptureId
                const thumb = capture.thumbnailURL || capture.downloadURL

                return (
                  <button
                    key={capture.id}
                    className={`viewer-capture-card${isActive ? ' active' : ''}`}
                    onClick={() => setSelectedCaptureId(capture.id)}
                    type="button"
                  >
                    <div className="viewer-capture-thumb">
                      {thumb ? <img src={thumb} alt={capture.fileName || 'capture'} /> : <span>📷</span>}
                    </div>
                    <div>
                      <h4>{capture.fileName || 'Captura'}</h4>
                      <p>{CAPTURE_LABELS[capture.type] || 'Archivo'}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </aside>

        <div className="viewer-stage">
          {viewMode === '360' && (
            <div className="viewer-frame">
              {selectedCapture?.downloadURL ? (
                <Pannellum
                  width="100%"
                  height="100%"
                  image={selectedCapture.downloadURL}
                  pitch={10}
                  yaw={180}
                  hfov={110}
                  autoLoad
                  showZoomCtrl
                  showFullscreenCtrl
                />
              ) : (
                <div className="viewer-placeholder">
                  <div style={{ fontSize: '4rem', marginBottom: '12px' }}>🌐</div>
                  <h3>Visor 360°</h3>
                  <p>
                    Sube al menos una imagen 360° para iniciar el recorrido inmersivo del proyecto.
                  </p>
                </div>
              )}
            </div>
          )}

          {viewMode === '3d' && (
            <div className="viewer-placeholder viewer-placeholder-blue">
              <div style={{ fontSize: '4rem', marginBottom: '12px' }}>🏗️</div>
              <h3>Visor 3D</h3>
              <p>Visualización interactiva del modelo 3D (Requiere Three.js/Potree).</p>
              {captureSummary[CaptureType.SCAN_3D] === 0 && (
                <span>Sube escaneos 3D para habilitar esta vista.</span>
              )}
            </div>
          )}

          {viewMode === 'plan' && (
            <div className="viewer-placeholder viewer-placeholder-purple">
              <div style={{ fontSize: '4rem', marginBottom: '12px' }}>🗺️</div>
              <h3>Vista de Plano</h3>
              <p>Planos 2D generados automáticamente a partir de tus capturas.</p>
              <span>Formatos: DWG, DXF, PDF, PNG.</span>
            </div>
          )}

          <div className="viewer-controls">
            <button title="Zoom In">🔍+</button>
            <button title="Zoom Out">🔍-</button>
            <button title="Reset View">🔄</button>
            <button title="Fullscreen">⛶</button>
            <button title="Settings">⚙️</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewerPage
