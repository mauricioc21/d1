import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const UploadPage = () => {
  const navigate = useNavigate()
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState([])
  const [projectName, setProjectName] = useState('')
  const [storageLocation, setStorageLocation] = useState('firebase') // firebase or local
  const [captureType, setCaptureType] = useState('photo') // photo, photo360, scan3d

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    setFiles(prev => [...prev, ...droppedFiles])
  }

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files)
    setFiles(prev => [...prev, ...selectedFiles])
  }

  const handleRemoveFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleUpload = () => {
    if (files.length === 0 || !projectName) {
      alert('Por favor, ingresa un nombre de proyecto y selecciona archivos')
      return
    }

    // Simulación de carga
    alert(`Subiendo ${files.length} archivos al proyecto "${projectName}" en ${storageLocation}...`)
    
    // En producción, aquí iría la lógica de subida a Firebase o almacenamiento local
    setTimeout(() => {
      navigate('/projects')
    }, 1000)
  }

  return (
    <div className="upload-page" style={{ padding: '40px 20px', minHeight: 'calc(100vh - 140px)' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Crear Nuevo Proyecto</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '40px' }}>
          Sube tus capturas para crear un proyecto de escaneo 3D
        </p>

        {/* Project Configuration */}
        <div className="card" style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '20px' }}>Configuración del Proyecto</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontWeight: '600'
            }}>
              Nombre del Proyecto *
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Ej: Casa Modelo, Apartamento 101..."
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 'var(--border-radius)',
                border: '1px solid var(--bg-tertiary)',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontWeight: '600'
            }}>
              Tipo de Captura
            </label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setCaptureType('photo')}
                className={`btn ${captureType === 'photo' ? 'btn-primary' : 'btn-secondary'}`}
              >
                📷 Fotos
              </button>
              <button
                onClick={() => setCaptureType('photo360')}
                className={`btn ${captureType === 'photo360' ? 'btn-primary' : 'btn-secondary'}`}
              >
                🌐 Fotos 360°
              </button>
              <button
                onClick={() => setCaptureType('scan3d')}
                className={`btn ${captureType === 'scan3d' ? 'btn-primary' : 'btn-secondary'}`}
              >
                📐 Escaneo 3D
              </button>
            </div>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontWeight: '600'
            }}>
              Almacenamiento
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setStorageLocation('firebase')}
                className={`btn ${storageLocation === 'firebase' ? 'btn-primary' : 'btn-secondary'}`}
              >
                ☁️ Firebase (Nube)
              </button>
              <button
                onClick={() => setStorageLocation('local')}
                className={`btn ${storageLocation === 'local' ? 'btn-primary' : 'btn-secondary'}`}
              >
                📱 Local (Dispositivo)
              </button>
            </div>
          </div>
        </div>

        {/* Upload Area */}
        <div
          className={`upload-area ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('fileInput').click()}
        >
          <div className="upload-icon">📁</div>
          <h3>Arrastra archivos aquí</h3>
          <p>o haz clic para seleccionar</p>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)', marginTop: '10px' }}>
            Formatos soportados: JPG, PNG, MP4, OBJ, PLY
          </p>
          <input
            id="fileInput"
            type="file"
            multiple
            accept="image/*,video/*,.obj,.ply,.las"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </div>

        {/* Files List */}
        {files.length > 0 && (
          <div className="card" style={{ marginTop: '30px' }}>
            <h3 style={{ marginBottom: '20px' }}>
              Archivos Seleccionados ({files.length})
            </h3>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {files.map((file, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    borderBottom: '1px solid var(--bg-tertiary)',
                    background: index % 2 === 0 ? 'transparent' : 'var(--bg-secondary)'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '500' }}>{file.name}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveFile(index)
                    }}
                    style={{
                      background: 'var(--danger-color)',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: 'var(--border-radius)',
                      cursor: 'pointer'
                    }}
                  >
                    ✕ Eliminar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ 
          marginTop: '30px', 
          display: 'flex', 
          gap: '15px',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={() => navigate('/projects')}
            className="btn btn-secondary"
            style={{ padding: '12px 30px' }}
          >
            Cancelar
          </button>
          <button
            onClick={handleUpload}
            className="btn btn-primary"
            style={{ padding: '12px 30px' }}
            disabled={files.length === 0 || !projectName}
          >
            Crear Proyecto
          </button>
        </div>
      </div>
    </div>
  )
}

export default UploadPage
