import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import useProjects from '../hooks/useProjects'

const formatDate = (value) => {
  if (!value) return 'Sin fecha'

  if (value instanceof Date) {
    return value.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return value
}

const ProjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const { projects, loading, error } = useProjects()

  const normalizedProjects = useMemo(
    () =>
      projects.map((project) => ({
        ...project,
        status: project.status?.toLowerCase?.() ?? 'active',
        storage: project.storage ?? 'firebase',
        dateLabel: formatDate(project.date),
      })),
    [projects]
  )

  const filteredProjects = useMemo(
    () =>
      normalizedProjects.filter((project) => {
        const matchesSearch = project.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
        const matchesFilter =
          filterStatus === 'all' || project.status === filterStatus
        return matchesSearch && matchesFilter
      }),
    [normalizedProjects, searchTerm, filterStatus]
  )

  return (
    <div className="projects-page" style={{ padding: '40px 20px', minHeight: 'calc(100vh - 140px)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Mis Proyectos</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            Gestiona todos tus proyectos de escaneo 3D
          </p>
        </div>

        {/* Filters and Search */}
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
              minWidth: '250px',
              padding: '12px 20px',
              borderRadius: 'var(--border-radius)',
              border: '1px solid var(--bg-tertiary)',
              fontSize: '1rem',
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
            }}
          >
            <option value="all">Todos</option>
            <option value="active">En Proceso</option>
            <option value="completed">Completados</option>
          </select>

          <Link to="/upload" className="btn btn-primary">
            + Nuevo Proyecto
          </Link>
        </div>

        {/* Projects Grid */}
        {loading ? (
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
            {filteredProjects.map((project) => (
              <div key={project.id} className="project-card">
                <div className="project-thumbnail">
                  <span>📋</span>
                </div>
                <div className="project-info">
                  <h3>{project.name}</h3>
                  <div className="project-meta">
                    <span>📅 {project.dateLabel}</span>
                    <span className={`status-badge ${project.status}`}>
                      {project.status === 'active' ? 'En Proceso' : 'Completado'}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      gap: '20px',
                      marginBottom: '15px',
                      fontSize: '0.9rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <span>📷 {project.images} fotos</span>
                    <span>📐 {project.scans} escaneos</span>
                    <span>
                      {project.storage === 'firebase' ? '☁️' : '📱'} {project.storage}
                    </span>
                  </div>
                  <div className="project-actions">
                    <Link to={`/viewer/${project.id}`} className="btn btn-secondary">
                      Ver
                    </Link>
                    <button className="btn btn-primary">Exportar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📁</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>
              No se encontraron proyectos
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Intenta con otros términos de búsqueda o crea un nuevo proyecto
            </p>
            <Link to="/upload" className="btn btn-primary">
              Crear Proyecto
            </Link>
          </div>
        )}
      </div>

      <style jsx>{`
        .status-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        .status-badge.active {
          background: #FF9500;
          color: white;
        }
        .status-badge.completed {
          background: #34C759;
          color: white;
        }
      `}</style>
    </div>
  )
}

export default ProjectsPage
