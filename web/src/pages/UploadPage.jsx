import React, { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../contexts/AuthContext'
import {
  createProject,
  createCapture,
  updateProject,
  deleteProject,
} from '../services/data'
import { storage } from '../services/firebase'
import { CaptureType, ProjectStatus } from '@shared/data'
import {
  generateUniqueFileName,
  getStoragePath,
  validateFileSize,
  formatBytes,
  isImageFile,
  getFileExtension,
} from '@shared/utils/storage.utils'
import { storageConfig } from '@shared/config/firebase.config'

const STORAGE_FOLDER_BY_MODE = {
  [CaptureType.PHOTO]: 'photos',
  [CaptureType.PHOTO_360]: 'photos360',
  [CaptureType.SCAN_3D]: 'scans',
  [CaptureType.VIDEO]: 'videos',
}

const SIZE_KEY_BY_MODE = {
  [CaptureType.PHOTO]: 'photo',
  [CaptureType.PHOTO_360]: 'photo360',
  [CaptureType.SCAN_3D]: 'scan',
  [CaptureType.VIDEO]: 'video',
}

const CAPTURE_TYPE_LABEL = {
  [CaptureType.PHOTO]: 'Fotos',
  [CaptureType.PHOTO_360]: 'Fotos 360°',
  [CaptureType.SCAN_3D]: 'Escaneos 3D',
  [CaptureType.VIDEO]: 'Videos',
}

const UploadPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const fileInputRef = useRef(null)

  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState([])
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [storageLocation, setStorageLocation] = useState('firebase')
  const [captureType, setCaptureType] = useState(CaptureType.PHOTO)
  const [uploadProgress, setUploadProgress] = useState({})
  const [isUploading, setIsUploading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [infoMessage, setInfoMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [failedFiles, setFailedFiles] = useState([])
  const [uploadSummary, setUploadSummary] = useState({ completed: 0, failed: 0, bytes: 0 })

  const captureSizeKey = useMemo(
    () => SIZE_KEY_BY_MODE[captureType] || 'photo',
    [captureType]
  )

  const captureSizeLimitMB = storageConfig?.maxSizes?.[captureSizeKey] || storageConfig.maxSizes.photo

  const totalSize = useMemo(
    () => files.reduce((acc, item) => acc + (item.file?.size || 0), 0),
    [files]
  )

  const totalUploadedBytes = useMemo(
    () =>
      Object.values(uploadProgress).reduce(
        (acc, entry) => acc + (entry.uploadedBytes || 0),
        0
      ),
    [uploadProgress]
  )

  const overallProgress = totalSize > 0
    ? Math.min(100, Math.round((totalUploadedBytes / totalSize) * 100))
    : 0

  const buildFileEntry = (file) => {
    const key = `${file.name}-${file.size}-${file.lastModified}`
    return {
      id: key,
      key,
      file,
      name: file.name,
      size: file.size,
      extension: getFileExtension(file.name)?.toLowerCase() || '',
      type: file.type,
    }
  }

  const appendFiles = (incoming = []) => {
    if (!incoming.length) return

    if (isUploading) {
      setInfoMessage('Espera a que finalice la subida actual antes de agregar más archivos.')
      return
    }

    setErrorMessage('')
    setSuccessMessage('')
    setInfoMessage('')
    setFailedFiles([])
    setUploadSummary({ completed: 0, failed: 0, bytes: 0 })

    setFiles((prev) => {
      const existingKeys = new Set(prev.map((item) => item.key))
      const next = [...prev]
      const duplicates = []

      incoming.forEach((file) => {
        const entry = buildFileEntry(file)
        if (existingKeys.has(entry.key)) {
          duplicates.push(entry.name)
          return
        }
        existingKeys.add(entry.key)
        next.push(entry)
      })

      if (duplicates.length > 0) {
        setInfoMessage(
          `Omitimos ${duplicates.length} archivo${duplicates.length !== 1 ? 's' : ''} duplicado${duplicates.length !== 1 ? 's' : ''}.`
        )
      }

      return next
    })
  }

  const resetState = () => {
    setFiles([])
    setUploadProgress({})
    setFailedFiles([])
    setUploadSummary({ completed: 0, failed: 0, bytes: 0 })
    setErrorMessage('')
    setInfoMessage('')
    setSuccessMessage('')
    setProjectName('')
    setProjectDescription('')
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    if (!isUploading) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    if (isUploading) return

    setIsDragging(false)
    const droppedFiles = Array.from(e.dataTransfer?.files || [])
    appendFiles(droppedFiles)
  }

  const handleFileSelect = (e) => {
    if (isUploading) return
    const selectedFiles = Array.from(e.target.files || [])
    appendFiles(selectedFiles)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveFile = (fileId) => {
    if (isUploading) return
    setFiles((prev) => prev.filter((item) => item.id !== fileId))
    setUploadProgress((prev) => {
      if (!prev[fileId]) return prev
      const next = { ...prev }
      delete next[fileId]
      return next
    })
  }

  const handleClearFiles = () => {
    if (isUploading) return
    setFiles([])
    setUploadProgress({})
    setFailedFiles([])
    setInfoMessage('')
    setUploadSummary({ completed: 0, failed: 0, bytes: 0 })
  }

  const handleUpload = async () => {
    if (!user?.uid) {
      setErrorMessage('Debes iniciar sesión para crear un proyecto.')
      return
    }

    const trimmedName = projectName.trim()
    if (!trimmedName) {
      setErrorMessage('Ingresa un nombre para el proyecto.')
      return
    }

    if (files.length === 0) {
      setErrorMessage('Selecciona al menos un archivo para subir.')
      return
    }

    const filesSnapshot = [...files]
    const invalidFiles = filesSnapshot.filter((entry) => !validateFileSize(entry.file.size, captureSizeKey))
    if (invalidFiles.length > 0) {
      const fileNames = invalidFiles.map((entry) => entry.name).join(', ')
      setErrorMessage(
        `Los siguientes archivos superan el límite de ${captureSizeLimitMB} MB para ${CAPTURE_TYPE_LABEL[captureType] || 'este modo'}: ${fileNames}.`
      )
      return
    }

    setErrorMessage('')
    setInfoMessage('')
    setSuccessMessage('')
    setFailedFiles([])
    setUploadSummary({ completed: 0, failed: 0, bytes: 0 })

    const initialProgress = filesSnapshot.reduce((acc, entry) => {
      acc[entry.id] = {
        progress: 0,
        uploadedBytes: 0,
        totalBytes: entry.file.size,
        status: 'pending',
      }
      return acc
    }, {})
    setUploadProgress(initialProgress)
    setIsUploading(true)

    try {
      const storageFolder = STORAGE_FOLDER_BY_MODE[captureType] || 'photos'

      const project = await createProject(
        {
          name: trimmedName,
          description: projectDescription.trim(),
          status: ProjectStatus.ACTIVE,
          captureMode: captureType,
          metadata: {
            storageLocation,
            createdFrom: 'web',
            lastUploadSource: 'web',
            totalFiles: 0,
            totalSizeBytes: 0,
          },
        },
        { userId: user.uid }
      )

      let coverImageUrl = project.coverImageUrl || null
      const successfulUploads = []
      const failedUploads = []

      for (let index = 0; index < filesSnapshot.length; index += 1) {
        const entry = filesSnapshot[index]
        const { file, id: fileKey } = entry

        try {
          const extension = getFileExtension(file.name) || 'bin'
          const storageFileName = generateUniqueFileName('capture', extension)
          const storagePath = getStoragePath(storageFolder, user.uid, storageFileName)
          const storageRef = storage.ref().child(storagePath)

          await new Promise((resolve, reject) => {
            const uploadTask = storageRef.put(file)

            uploadTask.on(
              'state_changed',
              (snapshot) => {
                const { bytesTransferred, totalBytes } = snapshot
                const progress = totalBytes
                  ? Math.round((bytesTransferred / totalBytes) * 100)
                  : 0

                setUploadProgress((prev) => ({
                  ...prev,
                  [fileKey]: {
                    progress,
                    uploadedBytes: bytesTransferred,
                    totalBytes,
                    status: progress >= 100 ? 'completed' : 'uploading',
                  },
                }))
              },
              (error) => reject(error),
              async () => {
                try {
                  const downloadURL = await storageRef.getDownloadURL()
                  const capture = await createCapture(
                    {
                      projectId: project.id,
                      userId: user.uid,
                      type: captureType,
                      storagePath,
                      downloadURL,
                      thumbnailURL: isImageFile(file.name) ? downloadURL : null,
                      fileName: storageFileName,
                      fileSize: file.size,
                      captureMetadata: {
                        originalName: file.name,
                        storageLocation,
                        uploadSource: 'web',
                        extension,
                        fileSizeReadable: formatBytes(file.size),
                      },
                      processing: {
                        state: 'completed',
                        progress: 100,
                        priority: 'normal',
                      },
                    },
                    { userId: user.uid }
                  )

                  successfulUploads.push({ file, capture, downloadURL })

                  setUploadProgress((prev) => ({
                    ...prev,
                    [fileKey]: {
                      progress: 100,
                      uploadedBytes: file.size,
                      totalBytes: file.size,
                      status: 'completed',
                    },
                  }))

                  if (!coverImageUrl && isImageFile(file.name)) {
                    coverImageUrl = downloadURL
                  }

                  resolve()
                } catch (captureError) {
                  reject(captureError)
                }
              }
            )
          })
        } catch (fileError) {
          console.error(`Error subiendo archivo ${entry.name}`, fileError)
          failedUploads.push({
            id: fileKey,
            name: entry.name,
            message: fileError.message || 'Error desconocido durante la subida.',
          })

          setUploadProgress((prev) => ({
            ...prev,
            [fileKey]: {
              progress: prev[fileKey]?.progress ?? 0,
              uploadedBytes: prev[fileKey]?.uploadedBytes ?? 0,
              totalBytes: entry.file.size,
              status: 'error',
            },
          }))
        }
      }

      const uploadedBytes = successfulUploads.reduce((acc, item) => acc + (item.file?.size || 0), 0)
      setUploadSummary({
        completed: successfulUploads.length,
        failed: failedUploads.length,
        bytes: uploadedBytes,
      })

      if (successfulUploads.length > 0) {
        const existingMetadata = project.metadata || {}
        const previousTotalFiles = Number(existingMetadata.totalFiles || 0)
        const previousTotalBytes = Number(existingMetadata.totalSizeBytes || 0)
        const newTotalFiles = previousTotalFiles + successfulUploads.length
        const newTotalBytes = previousTotalBytes + uploadedBytes

        const metadataUpdate = {
          ...existingMetadata,
          storageLocation,
          lastUploadSource: 'web',
          lastUploadUser: user.uid,
          lastUploadAt: new Date().toISOString(),
          lastCaptureType: captureType,
          totalFiles: newTotalFiles,
          totalSizeBytes: newTotalBytes,
          totalSizeReadable: formatBytes(newTotalBytes),
        }

        await updateProject(
          project.id,
          {
            coverImageUrl,
            metadata: metadataUpdate,
          },
          { userId: user.uid }
        )
      }

      if (failedUploads.length > 0) {
        if (successfulUploads.length === 0) {
          await deleteProject(project.id, { hardDelete: true, userId: user.uid })
          setFailedFiles(failedUploads)
          setErrorMessage('No se pudo subir ningún archivo. Revisa los errores e intenta nuevamente.')
          return
        }

        const failedProgress = failedUploads.reduce((acc, failed) => {
          const fileEntry = filesSnapshot.find((item) => item.id === failed.id)
          acc[failed.id] = {
            progress: 0,
            uploadedBytes: 0,
            totalBytes: fileEntry?.file?.size || 0,
            status: 'pending',
          }
          return acc
        }, {})

        setUploadProgress(failedProgress)
        setFiles(filesSnapshot.filter((entry) => failedUploads.some((failed) => failed.id === entry.id)))
        setFailedFiles(failedUploads)
        setInfoMessage('Los archivos que fallaron permanecen en la lista para que puedas reintentarlo.')
        setErrorMessage('Algunos archivos no se pudieron subir. Corrige los errores e inténtalo nuevamente.')
        setSuccessMessage(`Subimos ${successfulUploads.length} archivo${successfulUploads.length !== 1 ? 's' : ''} correctamente.`)
        return
      }

      setSuccessMessage('Proyecto creado y archivos subidos correctamente.')
      setTimeout(() => {
        resetState()
        navigate('/projects')
      }, 1400)
    } catch (err) {
      console.error('Error uploading files', err)
      setErrorMessage(err.message || 'No pudimos completar la subida. Intenta nuevamente.')
    } finally {
      setIsUploading(false)
    }
  }

  const isUploadDisabled = isUploading || files.length === 0 || !projectName.trim()

  return (
    <div className="upload-page" style={{ padding: '40px 20px', minHeight: 'calc(100vh - 140px)' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Crear Nuevo Proyecto</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '32px' }}>
          Sube tus capturas para generar planos 2D/3D, recorridos 360° y modelos inteligentes.
        </p>

        {errorMessage && (
          <div className="alert-error">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="alert-success">{successMessage}</div>
        )}
        {infoMessage && (
          <div className="alert-info">{infoMessage}</div>
        )}

        <div className="card" style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '20px' }}>Configuración del Proyecto</h3>

          <div style={{ marginBottom: '20px' }}>
            <label className="form-label">Nombre del Proyecto *</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Ej: Casa Modelo, Apartamento 101..."
              className="form-input"
              disabled={isUploading}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label className="form-label">Descripción (opcional)</label>
            <textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Describe el proyecto, ubicación, notas para el equipo, etc."
              className="form-input"
              rows={3}
              disabled={isUploading}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label className="form-label">Tipo de Captura</label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setCaptureType(CaptureType.PHOTO)}
                className={`btn ${captureType === CaptureType.PHOTO ? 'btn-primary' : 'btn-secondary'}`}
                disabled={isUploading}
              >
                📷 Fotos
              </button>
              <button
                type="button"
                onClick={() => setCaptureType(CaptureType.PHOTO_360)}
                className={`btn ${captureType === CaptureType.PHOTO_360 ? 'btn-primary' : 'btn-secondary'}`}
                disabled={isUploading}
              >
                🌐 Fotos 360°
              </button>
              <button
                type="button"
                onClick={() => setCaptureType(CaptureType.SCAN_3D)}
                className={`btn ${captureType === CaptureType.SCAN_3D ? 'btn-primary' : 'btn-secondary'}`}
                disabled={isUploading}
              >
                📐 Escaneo 3D
              </button>
            </div>
          </div>

          <div>
            <label className="form-label">Almacenamiento</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setStorageLocation('firebase')}
                className={`btn ${storageLocation === 'firebase' ? 'btn-primary' : 'btn-secondary'}`}
                disabled={isUploading}
              >
                ☁️ Firebase (Nube)
              </button>
              <button
                type="button"
                onClick={() => setStorageLocation('local')}
                className={`btn ${storageLocation === 'local' ? 'btn-primary' : 'btn-secondary'}`}
                disabled={isUploading}
              >
                📱 Local (Dispositivo)
              </button>
            </div>
          </div>
        </div>

        <div
          className={`upload-area ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => {
            if (!isUploading && fileInputRef.current) {
              fileInputRef.current.click()
            }
          }}
        >
          <div className="upload-icon">📁</div>
          <h3>{isUploading ? 'Subiendo archivos...' : 'Arrastra archivos aquí'}</h3>
          <p>{isUploading ? 'Estamos procesando tus capturas, espera un momento.' : 'o haz clic para seleccionar'}</p>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)', marginTop: '10px' }}>
            Formatos soportados: JPG, PNG, MP4, OBJ, PLY — Límite por archivo: {captureSizeLimitMB} MB
          </p>
          <input
            ref={fileInputRef}
            id="fileInput"
            type="file"
            multiple
            accept="image/*,video/*,.obj,.ply,.las,.mp4,.mov"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            disabled={isUploading}
          />
        </div>

        {files.length > 0 && (
          <div className="card upload-files-card" style={{ marginTop: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center', gap: '16px' }}>
              <div>
                <h3>Archivos Seleccionados ({files.length})</h3>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                  Tamaño total: {formatBytes(totalSize)}
                </span>
              </div>
              <button
                type="button"
                onClick={handleClearFiles}
                className="btn btn-secondary"
                disabled={isUploading}
              >
                Vaciar lista
              </button>
            </div>
            <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
              {files.map((entry) => {
                const progressEntry = uploadProgress[entry.id]
                const progressValue = Math.min(100, Math.max(0, progressEntry?.progress ?? 0))
                const status = progressEntry?.status
                const showProgress = Boolean(progressEntry) || isUploading

                return (
                  <div key={entry.id} className="upload-file-row">
                    <div style={{ flex: 1 }}>
                      <div className="upload-file-name">{entry.name}</div>
                      <div className="upload-file-meta">
                        {formatBytes(entry.size)}
                        {entry.extension ? ` · ${entry.extension.toUpperCase()}` : ''}
                      </div>
                      {status && (
                        <span
                          className={`upload-status-pill ${
                            status === 'completed'
                              ? 'success'
                              : status === 'error'
                                ? 'error'
                                : 'uploading'
                          }`}
                        >
                          {status === 'completed'
                            ? 'Listo'
                            : status === 'error'
                              ? 'Error'
                              : 'Subiendo'}
                        </span>
                      )}
                      {showProgress && (
                        <div className="progress-bar" style={{ marginTop: '12px' }}>
                          <div
                            className="progress-bar-fill"
                            style={{
                              width: `${progressValue}%`,
                              background:
                                status === 'error'
                                  ? 'rgba(255, 128, 128, 0.9)'
                                  : undefined,
                            }}
                          />
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveFile(entry.id)
                      }}
                      className="btn btn-secondary"
                      disabled={isUploading}
                    >
                      ✕
                    </button>
                  </div>
                )
              })}
            </div>

            {isUploading && (
              <div className="upload-overall-progress">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', color: 'var(--text-secondary)' }}>
                  <span>Progreso total</span>
                  <span>{overallProgress}%</span>
                </div>
                <div className="progress-bar" style={{ marginTop: '8px', height: '8px' }}>
                  <div className="progress-bar-fill" style={{ width: `${overallProgress}%` }} />
                </div>
              </div>
            )}

            {!isUploading && (uploadSummary.completed > 0 || uploadSummary.failed > 0) && (
              <div className="upload-summary">
                <span>✅ {uploadSummary.completed} subido{uploadSummary.completed !== 1 ? 's' : ''}</span>
                <span>⚠️ {uploadSummary.failed} pendiente{uploadSummary.failed !== 1 ? 's' : ''}</span>
                <span>📦 {formatBytes(uploadSummary.bytes)} transferidos</span>
              </div>
            )}
          </div>
        )}

        {failedFiles.length > 0 && (
          <div className="card upload-errors-card">
            <h3>Archivos con error ({failedFiles.length})</h3>
            <ul>
              {failedFiles.map((failed) => (
                <li key={failed.id}>
                  <strong>{failed.name}</strong>
                  <span>{failed.message}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div
          style={{
            marginTop: '30px',
            display: 'flex',
            gap: '15px',
            justifyContent: 'flex-end',
          }}
        >
          <button
            type="button"
            onClick={() => {
              if (!isUploading) {
                navigate('/projects')
              }
            }}
            className="btn btn-secondary"
            style={{ padding: '12px 30px' }}
            disabled={isUploading}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleUpload}
            className="btn btn-primary"
            style={{ padding: '12px 30px' }}
            disabled={isUploadDisabled}
          >
            {isUploading ? 'Subiendo...' : 'Crear Proyecto'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default UploadPage
