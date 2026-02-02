import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const ProjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all') // all, active, completed

  // Datos de ejemplo
  const projects = [
    {
      id: '1',
      name: 'Casa Ejemplo',
      date: '2026-02-01',
      images: 24,
      scans: 2,
      status: 'active',
      storage: 'firebase'
    },
    {
      id: '2',
      name: 'Apartamento 402',
      date: '2026-01-28',
      images: 18,
      scans: 1,
      status: 'completed',
      storage: 'local'
    },
    {
      id: '3',
      name: 'Oficina Central',
      date: '2026-01-25',
      images: 42,
      scans: 3,
      status: 'active',
      storage: 'firebase'
    },
    {
      id: '4',
      name: 'Centro Comercial',
      date: '2026-01-20',
      images: 156,
      scans: 8,
      status: 'completed',
      storage: 'firebase'
    }
  ]

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus
    return matchesSearch && matchesFilter
  })

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
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          marginBottom: '30px',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
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
              fontSize: '1rem'
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
              cursor: 'pointer'
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
        {filteredProjects.length > 0 ? (
          <div className="projects-grid">
            {filteredProjects.map((project) => (
              <div key={project.id} className="project-card">
                <div className="project-thumbnail">
                  <span>📋</span>
                </div>
                <div className="project-info">
                  <h3>{project.name}</h3>
                  <div className="project-meta">
                    <span>📅 {project.date}</span>
                    <span className={`status-badge ${project.status}`}>
                      {project.status === 'active' ? 'En Proceso' : 'Completado'}
                    </span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    gap: '20px', 
                    marginBottom: '15px',
                    fontSize: '0.9rem',
                    color: 'var(--text-secondary)'
                  }}>
                    <span>📷 {project.images} fotos</span>
                    <span>📐 {project.scans} escaneos</span>
                    <span>{project.storage === 'firebase' ? '☁️' : '📱'} {project.storage}</span>
                  </div>
                  <div className="project-actions">
                    <Link to={`/viewer/${project.id}`} className="btn btn-secondary">
                      Ver
                    </Link>
                    <button className="btn btn-primary">
                      Exportar
                    </button>
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
