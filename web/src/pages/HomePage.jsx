import React from 'react'
import { Link } from 'react-router-dom'

const HomePage = () => {
  const features = [
    {
      icon: '📷',
      title: 'Captura 360°',
      description: 'Toma fotos panorámicas completas con cámaras Insta360 y más'
    },
    {
      icon: '📐',
      title: 'Escaneo 3D',
      description: 'Crea modelos 3D precisos de cualquier espacio'
    },
    {
      icon: '🗺️',
      title: 'Planos CAD/BIM',
      description: 'Genera planos 2D y 3D compatibles con AutoCAD y Revit'
    },
    {
      icon: '🚶',
      title: 'Recorridos Virtuales',
      description: 'Navega por espacios capturados de manera inmersiva'
    },
    {
      icon: '☁️',
      title: 'Almacenamiento Flexible',
      description: 'Guarda en Firebase o localmente según tus necesidades'
    },
    {
      icon: '📤',
      title: 'Exportación Multi-formato',
      description: 'Exporta a DWG, IFC, OBJ, FBX y muchos más'
    }
  ]

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Su Todero D1</h1>
          <p>Escaneo 3D profesional y captura 360° al alcance de todos</p>
          <div className="hero-buttons">
            <Link to="/upload" className="btn btn-primary">Comenzar Ahora</Link>
            <Link to="/projects" className="btn btn-secondary">Ver Proyectos</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <h2>Características Principales</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card fade-in">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container" style={{ textAlign: 'center', padding: '80px 20px' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>
            ¿Listo para comenzar?
          </h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '30px', color: 'var(--text-secondary)' }}>
            Crea tu primer proyecto de escaneo 3D hoy mismo
          </p>
          <Link to="/upload" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '15px 35px' }}>
            Crear Proyecto
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ background: 'var(--bg-primary)', padding: '60px 20px' }}>
        <div className="container">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '40px',
            textAlign: 'center'
          }}>
            <div>
              <h3 style={{ fontSize: '3rem', color: 'var(--primary-color)', marginBottom: '10px' }}>
                100+
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>Proyectos Creados</p>
            </div>
            <div>
              <h3 style={{ fontSize: '3rem', color: 'var(--primary-color)', marginBottom: '10px' }}>
                10K+
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>Capturas Realizadas</p>
            </div>
            <div>
              <h3 style={{ fontSize: '3rem', color: 'var(--primary-color)', marginBottom: '10px' }}>
                50+
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>Clientes Satisfechos</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
