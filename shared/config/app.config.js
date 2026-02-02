/**
 * Configuración general de la aplicación Su Todero D1
 */

export const appConfig = {
  name: 'Su Todero D1',
  version: '1.0.0',
  
  // Configuración de cámaras soportadas
  cameras: {
    supported360: [
      {
        brand: 'Insta360',
        models: ['ONE X', 'ONE X2', 'ONE X3', 'ONE RS'],
        connection: 'bluetooth/wifi'
      },
      {
        brand: 'Ricoh',
        models: ['Theta V', 'Theta Z1'],
        connection: 'wifi'
      }
    ],
    
    // Configuración de captura
    captureSettings: {
      photo: {
        quality: 0.9,
        format: 'jpg',
        maxResolution: { width: 4096, height: 3072 }
      },
      photo360: {
        quality: 0.95,
        format: 'jpg',
        equirectangular: true
      },
      video: {
        quality: 'high',
        fps: 30,
        format: 'mp4'
      }
    }
  },
  
  // Configuración de escaneo 3D
  scanning: {
    // Métodos de captura 3D
    methods: {
      photogrammetry: true,    // Reconstrucción desde fotos
      lidar: true,             // Sensor LiDAR (iOS)
      depthCamera: true,       // Cámara de profundidad (Android)
      structured_light: false  // Luz estructurada (futuro)
    },
    
    // Configuración de procesamiento
    processing: {
      pointCloudDensity: 'medium', // low, medium, high
      meshQuality: 'medium',
      textureResolution: 2048
    }
  },
  
  // Formatos de exportación
  export: {
    formats: {
      cad: ['dwg', 'dxf', 'dwf'],
      bim: ['ifc', 'rvt'],
      '3d': ['obj', 'fbx', 'ply', 'stl', 'gltf'],
      images: ['jpg', 'png'],
      pointCloud: ['las', 'laz', 'ply', 'xyz']
    }
  },
  
  // Configuración de almacenamiento
  storage: {
    defaultLocation: 'firebase', // 'firebase' o 'local'
    autoBackup: true,
    syncWhenWifi: true
  },
  
  // Límites y restricciones
  limits: {
    maxPhotosPerScan: 500,
    maxProjectSize: 5000, // MB
    maxProjects: 100
  }
};

export default appConfig;
