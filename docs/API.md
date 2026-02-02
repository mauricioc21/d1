# 📚 API Reference - Su Todero D1

## Servicios Compartidos

### Storage Utils

```javascript
import { 
  generateUniqueFileName,
  getStoragePath,
  validateFileSize,
  formatBytes 
} from '../shared/utils/storage.utils';

// Generar nombre único de archivo
const fileName = generateUniqueFileName('scan', 'jpg');
// Output: "scan_1706889600000_a7b3c2d.jpg"

// Obtener ruta de almacenamiento
const path = getStoragePath('scans', 'user123', 'model.obj');
// Output: "scans/user123/model.obj"

// Validar tamaño de archivo
const isValid = validateFileSize(5242880, 'photo'); // 5MB
// Output: true (si es menor al límite)

// Formatear bytes
const formatted = formatBytes(5242880);
// Output: "5.00 MB"
```

### Geometry Utils

```javascript
import {
  distance3D,
  normalizeVector,
  sphericalToCartesian,
  degreesToRadians
} from '../shared/utils/geometry.utils';

// Calcular distancia entre dos puntos
const dist = distance3D(
  { x: 0, y: 0, z: 0 },
  { x: 3, y: 4, z: 0 }
);
// Output: 5

// Normalizar vector
const normalized = normalizeVector({ x: 3, y: 4, z: 0 });
// Output: { x: 0.6, y: 0.8, z: 0 }

// Convertir coordenadas esféricas a cartesianas
const cartesian = sphericalToCartesian(1, 0, Math.PI / 2);
// Output: { x: 1, y: 0, z: 0 }
```

## Servicios Firebase (Mobile)

### Inicialización

```javascript
import { initializeFirebase } from './src/services/firebase.service';

// Inicializar Firebase
await initializeFirebase();
```

### Subir Archivos

```javascript
import { uploadFile } from './src/services/firebase.service';

// Subir archivo con progreso
const downloadURL = await uploadFile(
  '/path/to/file.jpg',
  'scans/user123/project456/image.jpg',
  (progress) => {
    console.log(`Progreso: ${progress}%`);
  }
);

console.log('URL de descarga:', downloadURL);
```

### Guardar Documentos

```javascript
import { saveDocument } from './src/services/firebase.service';

// Guardar proyecto
await saveDocument('projects', 'project123', {
  name: 'Casa Ejemplo',
  userId: 'user123',
  date: new Date().toISOString(),
  status: 'active',
  storageLocation: 'firebase',
  captureType: 'scan3d'
});
```

### Obtener Documentos

```javascript
import { getDocument, getCollection } from './src/services/firebase.service';

// Obtener un documento específico
const project = await getDocument('projects', 'project123');
console.log(project.name); // "Casa Ejemplo"

// Obtener colección con filtros
const activeProjects = await getCollection('projects', {
  where: [['status', '==', 'active']],
  orderBy: { field: 'date', direction: 'desc' },
  limit: 10
});

console.log(activeProjects.length); // 10 proyectos activos
```

## Hooks Personalizados (Ejemplos)

### useProjects

```javascript
// mobile/src/hooks/useProjects.js
import { useState, useEffect } from 'react';
import { getCollection } from '../services/firebase.service';

export const useProjects = (userId) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const data = await getCollection('projects', {
          where: [['userId', '==', userId]],
          orderBy: { field: 'date', direction: 'desc' }
        });
        setProjects(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadProjects();
    }
  }, [userId]);

  return { projects, loading, error };
};

// Uso en componente
const { projects, loading, error } = useProjects('user123');
```

### useCamera

```javascript
// mobile/src/hooks/useCamera.js
import { useState } from 'react';
import { Camera } from 'react-native-vision-camera';

export const useCamera = () => {
  const [hasPermission, setHasPermission] = useState(false);

  const requestPermission = async () => {
    const status = await Camera.requestCameraPermission();
    setHasPermission(status === 'authorized');
    return status === 'authorized';
  };

  const capturePhoto = async (camera) => {
    if (!camera) return null;
    
    const photo = await camera.takePhoto({
      qualityPrioritization: 'quality',
      flash: 'off',
    });
    
    return photo;
  };

  return {
    hasPermission,
    requestPermission,
    capturePhoto
  };
};

// Uso en componente
const { hasPermission, requestPermission, capturePhoto } = useCamera();
```

### useStorage

```javascript
// mobile/src/hooks/useStorage.js
import { useState } from 'react';
import { uploadFile } from '../services/firebase.service';
import RNFS from 'react-native-fs';

export const useStorage = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadToFirebase = async (localPath, remotePath) => {
    setUploading(true);
    try {
      const url = await uploadFile(localPath, remotePath, (p) => {
        setProgress(p);
      });
      return url;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const saveLocally = async (sourceUri, fileName) => {
    const destPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
    await RNFS.copyFile(sourceUri, destPath);
    return destPath;
  };

  return {
    uploadToFirebase,
    saveLocally,
    uploading,
    progress
  };
};

// Uso en componente
const { uploadToFirebase, saveLocally, uploading, progress } = useStorage();
```

## Componentes de Ejemplo

### ProjectCard

```javascript
// mobile/src/components/ProjectCard.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ProjectCard = ({ project, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.name}>{project.name}</Text>
        <Text style={styles.date}>{project.date}</Text>
      </View>
      <View style={styles.stats}>
        <Text>📷 {project.images} fotos</Text>
        <Text>📐 {project.scans} escaneos</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  date: {
    color: '#8E8E93',
  },
  stats: {
    flexDirection: 'row',
    gap: 20,
  },
});

export default ProjectCard;
```

### CameraButton

```javascript
// mobile/src/components/CameraButton.js
import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';

const CameraButton = ({ onPress, size = 70 }) => {
  return (
    <TouchableOpacity
      style={[styles.button, { width: size, height: size, borderRadius: size / 2 }]}
      onPress={onPress}
    >
      <View style={[styles.inner, { 
        width: size - 16, 
        height: size - 16, 
        borderRadius: (size - 16) / 2 
      }]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#007AFF',
  },
  inner: {
    backgroundColor: '#007AFF',
  },
});

export default CameraButton;
```

## API Web (React)

### Fetch Projects

```javascript
// web/src/services/projects.service.js
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';

export const fetchProjects = async (userId) => {
  const q = query(
    collection(db, 'projects'),
    where('userId', '==', userId)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};
```

### Upload to Storage

```javascript
// web/src/services/storage.service.js
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

export const uploadFileWeb = async (file, path, onProgress) => {
  const storageRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(progress);
      },
      (error) => reject(error),
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(url);
      }
    );
  });
};
```

## Exportación de Modelos

### Export to OBJ

```javascript
// Ejemplo conceptual - requiere librería específica
export const exportToOBJ = async (model3D) => {
  // Convertir modelo 3D a formato OBJ
  const objData = convertToOBJ(model3D);
  
  // Crear blob
  const blob = new Blob([objData], { type: 'text/plain' });
  
  // Descargar
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'model.obj';
  link.click();
};
```

### Export to DWG (Conceptual)

```javascript
// Requiere conversión server-side o librería especializada
export const exportToDWG = async (projectId) => {
  // Llamar a API backend para conversión
  const response = await fetch('/api/export/dwg', {
    method: 'POST',
    body: JSON.stringify({ projectId }),
    headers: { 'Content-Type': 'application/json' }
  });
  
  const blob = await response.blob();
  
  // Descargar archivo
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `project_${projectId}.dwg`;
  link.click();
};
```

## Tipos TypeScript (Opcional)

```typescript
// shared/types/index.ts

export interface Project {
  id: string;
  name: string;
  userId: string;
  date: string;
  status: 'active' | 'completed';
  storageLocation: 'firebase' | 'local';
  captureType: 'photo' | 'photo360' | 'scan3d';
  images: number;
  scans: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Scan {
  id: string;
  projectId: string;
  userId: string;
  images: string[];
  model3dUrl?: string;
  planUrl?: string;
  status: 'processing' | 'completed' | 'error';
  createdAt: Date;
  processedAt?: Date;
}

export interface Photo {
  id: string;
  projectId: string;
  userId: string;
  url: string;
  type: 'normal' | '360';
  metadata: {
    width: number;
    height: number;
    size: number;
    format: string;
  };
  createdAt: Date;
}
```

## Testing

### Unit Test Example

```javascript
// mobile/__tests__/storage.utils.test.js
import { generateUniqueFileName, validateFileSize } from '../shared/utils/storage.utils';

describe('Storage Utils', () => {
  test('generateUniqueFileName creates unique names', () => {
    const name1 = generateUniqueFileName('test', 'jpg');
    const name2 = generateUniqueFileName('test', 'jpg');
    expect(name1).not.toBe(name2);
    expect(name1).toMatch(/^test_\d+_\w+\.jpg$/);
  });

  test('validateFileSize validates correctly', () => {
    expect(validateFileSize(5 * 1024 * 1024, 'photo')).toBe(true);
    expect(validateFileSize(25 * 1024 * 1024, 'photo')).toBe(false);
  });
});
```

---

Para más ejemplos y documentación detallada, consulta:
- [Documentación de Arquitectura](./ARCHITECTURE.md)
- [Guía de Inicio](./GETTING_STARTED.md)
- [Configuración de Firebase](./FIREBASE_SETUP.md)
