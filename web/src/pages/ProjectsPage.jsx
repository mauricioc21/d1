import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import useProjects from '../hooks/useProjects'
import { useAuth } from '../contexts/AuthContext'
import { updateProject, deleteProject } from '../services/data'
import { ProjectStatus, CaptureType } from '@shared/data'

const STATUS_LABELS = {
  [ProjectStatus.DRAFT]: 'Borrador',
  [ProjectStatus.ACTIVE]: 'En proceso',
  [ProjectStatus.PROCESSING]: 'Procesando',
  [ProjectStatus.COMPLETED]: 'Completado',
  [ProjectStatus.ARCHIVED]: 'Archivado',
}

const CAPTURE_MODE_LABELS = {
  [CaptureType.PHOTO]: 'Fotografía',
  [CaptureType.PHOTO_360]: 'Foto 360°',
  [CaptureType.SCAN_3D]: 'Escaneo 3D',
  [CaptureType.VIDEO]: 'Video',
}

const STATUS_FILTERS = [
  { value: 'all', label: 'Todos' },
  { value: ProjectStatus.ACTIVE, label: 'En proceso' },
  { value: ProjectStatus.PROCESSING, label: 'Procesando' },
  { value: ProjectStatus.COMPLETED, label: 'Completados' },
  { value: ProjectStatus.ARCHIVED, label: 'Archivados' },
]

const formatDate = (value) => {
  if (!value) return 'Sin fecha'

  try {
    const date = value instanceof Date ? value : new Date(value)
    if (Number.isNaN(date.getTime())) {
      return 'Sin fecha'
    }
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch (err) {
    return 'Sin fecha'
  }
}

const ProjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedProject, setSelectedProject] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    status: ProjectStatus.ACTIVE,
    captureMode: CaptureType.PHOTO,
  })
  const [actionMessage, setActionMessage] = useState('')
  const [actionError, setActionError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { user, loading: authLoading } = useAuth()
  const { projects, loading, error } = useProjects({
    userId: user?.uid ?? null,
    enabled: !authLoading,
    limit: 100,
  })

  const filteredProjects = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return projects.filter((project) => {
      const status = project.status || ProjectStatus.ACTIVE
      const matchesStatus = filterStatus === 'all' || status === filterStatus
      const matchesSearch = normalizedSearch
        ? project.name?.toLowerCase().includes(normalizedSearch) ||
          project.description?.toLowerCase().includes(normalizedSearch)
        : true

      return matchesStatus && matchesSearch
    })
  }, [projects, searchTerm, filterStatus])

  const stats = useMemo(() => {
    const totalProjects = projects.length
    const totalCaptures = projects.reduce(
      (acc, project) => acc + (project.metrics?.totalCaptures || 0),
      0
    )
    const totalScans = projects.reduce(
      (acc, project) => acc + (project.metrics?.totalScans || 0),
      0
    )
    const activeProjects = projects.filter(
      (project) => project.status === ProjectStatus.ACTIVE || project.status === ProjectStatus.PROCESSING
    ).length

    return {
      totalProjects,
      totalCaptures,
      totalScans,
      activeProjects,
    }
  }, [projects])

  const handleOpenModal = (project) => {
    setSelectedProject(project)
    setFormState({
      name: project?.name || '',
      description: project?.description || '',
      status: project?.status || ProjectStatus.ACTIVE,
      captureMode: project?.captureMode || CaptureType.PHOTO,
    })
    setActionError('')
    setIsModalOpen(true)
  }

  const resetModalState = () => {
    setIsModalOpen(false)
    setSelectedProject(null)
    setFormState({
      name: '',
      description: '',
      status: ProjectStatus.ACTIVE,
      captureMode: CaptureType.PHOTO,
    })
    setIsSubmitting(false)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!selectedProject?.id) return

    setIsSubmitting(true)
    setActionError('')

    try {
      await updateProject(selectedProject.id, {
        name: formState.name.trim(),
        description: formState.description.trim(),
        status: formState.status,
        captureMode: formState.captureMode,
      })
      setActionMessage('Proyecto actualizado correctamente.')
      resetModalState()
    } catch (err) {
      console.error('Error updating project', err)
      setActionError('No se pudo actualizar el proyecto. Intenta nuevamente.')
      setIsSubmitting(false)
    }
  }

  const handleArchiveProject = async (project) => {
    if (!project?.id) return

    const confirmArchive = window.confirm(
      `¿Deseas archivar el proyecto "${project.name}"? Podrás restaurarlo más adelante.`
    )

    if (!confirmArchive) return

    try {
      await deleteProject(project.id, { hardDelete: false })
      setActionMessage('Proyecto archivado correctamente.')
    } catch (err) {
      console.error('Error archiving project', err)
      setActionError('No pudimos archivar el proyecto. Intenta de nuevo.')
    }
  }

  return (
    <div className="projects-page" style={{ padding: '40px 20px', minHeight: 'calc(100vh - 140px)' }}>
      <div className="container">
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2.6rem', marginBottom: '10px', color: 'var(--text-primary)' }}>Mis Proyectos</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            Gestiona tus escaneos 3D, capturas 360° y entregables en un solo lugar.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '36px',
          }}
        >
          <div className="stat-card">
            <div className="stat-value">{stats.totalProjects}</div>
            <div className="stat-label">Proyectos totales</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.activeProjects}</div>
            <div className="stat-label">Proyectos activos</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.totalCaptures}</div>
            <div className="stat-label">Capturas</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.totalScans}</div>
            <div className="stat-label">Escaneos 3D</div>
          </div>
        </div>

        {(actionMessage || actionError) && (
          <div
            style={{
              marginBottom: '24px',
              padding: '14px 20px',
              borderRadius: '14px',
              background: actionError ? 'rgba(255, 77, 77, 0.18)' : 'rgba(247, 199, 74, 0.18)',
              border: actionError ? '1px solid rgba(255, 77, 77, 0.45)' : '1px solid rgba(247, 199, 74, 0.35)',
              color: actionError ? '#ff6b6b' : 'var(--primary-color)',
            }}
          >
            {actionError || actionMessage}
          </div>
        )}

        <div
          style={{
            display: 'flex',
            gap: '20px',
            marginBottom: '30px',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <input
            type="text"
            placeholder="🔍 Buscar proyectos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              minWidth: '260px',
              padding: '12px 20px',
              borderRadius: 'var(--border-radius)',
              border: '1px solid var(--bg-tertiary)',
              fontSize: '1rem',
              background: 'var(--bg-secondary)',
              color: 'var(--text-light)',
            }}
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '12px 20px',
              borderRadius: 'var(--border-radius)',
              border: '1px solid var(--bg-tertiary)',
              fontSize: '1rem',
              cursor: 'pointer',
              background: 'var(--bg-secondary)',
              color: 'var(--text-light)',
            }}
          >
            {STATUS_FILTERS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <Link to="/upload" className="btn btn-primary">
            + Nuevo Proyecto
          </Link>
        </div>

        {authLoading || loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div className="spinner-large" />
            <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>
              Cargando proyectos...
            </p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>⚠️</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>
              Error al cargar proyectos
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>{error.message}</p>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="projects-grid">
            {filteredProjects.map((project) => {
              const statusLabel = STATUS_LABELS[project.status] || project.status
              const metrics = project.metrics || {}
              const storageLabel = project.metadata?.storageLocation || 'Firebase'
              const createdAtLabel = formatDate(project.createdAt)

              return (
                <div key={project.id} className="project-card">
                  <div className={`project-thumbnail${project.coverImageUrl ? ' has-image' : ''}`}>
                    {project.coverImageUrl ? (
                      <img src={project.coverImageUrl} alt={`Portada de ${project.name}`} />
                    ) : (
                      <span>📁</span>
                    )}
                  </div>
                  <div className="project-info">
                    <div className="project-header">
                      <h3>{project.name}</h3>
                      <span className={`status-pill status-${project.status || 'default'}`}>
                        {statusLabel}
                      </span>
                    </div>
                    <p className="project-description">
                      {project.description || 'Sin descripción asignada.'}
                    </p>
                    <div className="project-meta-row">
                      <span>📅 Creado: {createdAtLabel}</span>
                      <span>🎯 Modo: {CAPTURE_MODE_LABELS[project.captureMode] || 'Genérico'}</span>
                      <span>☁️ Almacenamiento: {storageLabel}</span>
                    </div>
                    <div className="project-stats-row">
                      <span>📷 Capturas: {metrics.totalCaptures || 0}</span>
                      <span>📐 Escaneos 3D: {metrics.totalScans || 0}</span>
                      <span>🌐 360°: {metrics.total360 || 0}</span>
                    </div>
                    <div className="project-actions">
                      <Link to={`/viewer/${project.id}`} className="btn btn-secondary">
                        Ver
                      </Link>
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleOpenModal(project)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleArchiveProject(project)}
                      >
                        Archivar
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📁</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>
              No encontramos proyectos
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Crea tu primer proyecto o ajusta los filtros de búsqueda.
            </p>
            <Link to="/upload" className="btn btn-primary">
              Crear Proyecto
            </Link>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Editar proyecto</h3>
              <button className="modal-close" onClick={resetModalState} aria-label="Cerrar">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body">
              <label className="modal-field">
                <span>Nombre del proyecto</span>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(e) => setFormState((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
              </label>

              <label className="modal-field">
                <span>Descripción</span>
                <textarea
                  value={formState.description}
                  onChange={(e) => setFormState((prev) => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  placeholder="Notas, detalles del espacio o estado del proyecto"
                />
              </label>

              <div className="modal-grid">
                <label className="modal-field">
                  <span>Estado</span>
                  <select
                    value={formState.status}
                    onChange={(e) => setFormState((prev) => ({ ...prev, status: e.target.value }))}
                  >
                    {Object.entries(STATUS_LABELS).map(([statusKey, label]) => (
                      <option key={statusKey} value={statusKey}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="modal-field">
                  <span>Modo de captura</span>
                  <select
                    value={formState.captureMode}
                    onChange={(e) => setFormState((prev) => ({ ...prev, captureMode: e.target.value }))}
                  >
                    {Object.entries(CAPTURE_MODE_LABELS).map(([modeKey, label]) => (
                      <option key={modeKey} value={modeKey}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {actionError && (
                <div className="modal-error">{actionError}</div>
              )}

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={resetModalState}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectsPage
