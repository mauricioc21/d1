# Documentación de Su Todero D1

## 📋 Tabla de Contenidos

1. [Arquitectura del Sistema](#arquitectura)
2. [Configuración de Firebase](#firebase)
3. [Integración de Cámaras 360°](#camaras)
4. [Procesamiento 3D](#procesamiento)
5. [Exportación CAD/BIM](#exportacion)

## 🏗️ Arquitectura del Sistema {#arquitectura}

### Estructura del Proyecto

```
su-todero-d1/
├── mobile/          # Aplicación React Native (iOS/Android)
│   ├── src/
│   │   ├── screens/    # Pantallas de la app
│   │   ├── services/   # Servicios (Firebase, Camera, etc)
│   │   ├── components/ # Componentes reutilizables
│   │   └── hooks/      # Custom hooks
│   └── App.js
│
├── web/             # Aplicación web React
│   ├── src/
│   │   ├── pages/      # Páginas principales
│   │   ├── components/ # Componentes UI
│   │   ├── services/   # Servicios web
│   │   └── hooks/      # Custom hooks
│   └── index.html
│
└── shared/          # Código compartido
    ├── config/     # Configuraciones
    └── utils/      # Utilidades compartidas
```

### Flujo de Datos

1. **Captura** → Usuario captura fotos/video con app móvil
2. **Procesamiento Local** → Validación y optimización inicial
3. **Almacenamiento** → Firebase Storage o almacenamiento local
4. **Procesamiento 3D** → Servidor/Cloud procesa modelos 3D
5. **Visualización** → Web/Mobile muestran resultados
6. **Exportación** → Generación de archivos CAD/BIM

## 🔥 Configuración de Firebase {#firebase}

### Paso 1: Crear Proyecto

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Habilita Analytics (opcional)

### Paso 2: Configurar Servicios

#### Authentication
```bash
# Habilitar métodos de autenticación
- Email/Password
- Google
- Apple (para iOS)
```

#### Cloud Firestore
```javascript
// Estructura de colecciones recomendada
users/
  {userId}/
    - name
    - email
    - createdAt

projects/
  {projectId}/
    - name
    - userId
    - date
    - status
    - storageLocation
    - captureType

scans/
  {scanId}/
    - projectId
    - images[]
    - model3dUrl
    - planUrl
```

#### Storage
```bash
# Estructura de carpetas
storage/
├── scans/{userId}/{projectId}/
│   ├── raw/           # Fotos originales
│   ├── processed/     # Fotos procesadas
│   └── models/        # Modelos 3D generados
├── photos/{userId}/
├── photos360/{userId}/
└── exports/{userId}/
```

### Paso 3: Configurar Credenciales

#### Para Web
```javascript
// web/src/services/firebase.js
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};

const app = initializeApp(firebaseConfig);
```

#### Para React Native
```bash
# Android
# Descarga google-services.json
# Colócalo en: mobile/android/app/google-services.json

# iOS
# Descarga GoogleService-Info.plist
# Colócalo en: mobile/ios/GoogleService-Info.plist
```

## 📷 Integración de Cámaras 360° {#camaras}

### Cámaras Soportadas

#### Insta360
- **ONE X2**: Bluetooth + WiFi
- **ONE X3**: Bluetooth + WiFi
- **ONE RS**: USB-C + WiFi

#### Ricoh Theta
- **Theta V**: WiFi
- **Theta Z1**: WiFi

### Protocolo de Conexión

```javascript
// Ejemplo de conexión Insta360
import { Insta360SDK } from 'react-native-insta360';

const connectCamera = async () => {
  // 1. Escanear dispositivos disponibles
  const devices = await Insta360SDK.scanDevices();
  
  // 2. Conectar a la cámara
  await Insta360SDK.connect(devices[0].id);
  
  // 3. Configurar modo de captura
  await Insta360SDK.setMode('photo360');
  
  // 4. Capturar
  const photo = await Insta360SDK.capture();
  
  return photo;
};
```

## 🎨 Procesamiento 3D {#procesamiento}

### Métodos de Captura

#### 1. Fotogrametría
- Tomar múltiples fotos desde diferentes ángulos
- Procesamiento con COLMAP o OpenMVG
- Generación de malla 3D

```python
# Ejemplo con Python + Open3D
import open3d as o3d

# Cargar nube de puntos
pcd = o3d.io.read_point_cloud("scan.ply")

# Limpiar ruido
pcd = pcd.remove_statistical_outlier(nb_neighbors=20, std_ratio=2.0)

# Generar malla
mesh = o3d.geometry.TriangleMesh.create_from_point_cloud_poisson(pcd)

# Exportar
o3d.io.write_triangle_mesh("model.obj", mesh)
```

#### 2. LiDAR (iOS)
- Usar sensor LiDAR de iPhone/iPad Pro
- Captura directa de profundidad
- Procesamiento más rápido

#### 3. Depth Camera (Android)
- Usar cámaras de profundidad (ToF)
- Similar a LiDAR pero menor precisión

### Pipeline de Procesamiento

1. **Captura** → Fotos/Video
2. **Pre-procesamiento** → Alineación, calibración
3. **Reconstrucción** → Nube de puntos
4. **Malla 3D** → Triangulación
5. **Texturizado** → Aplicar texturas
6. **Optimización** → Reducción de polígonos
7. **Exportación** → Formatos múltiples

## 📤 Exportación CAD/BIM {#exportacion}

### Formatos Soportados

#### CAD
- **DWG** (AutoCAD): Formato nativo de AutoCAD
- **DXF** (Drawing Exchange Format): Intercambio universal
- **DWF** (Design Web Format): Visualización web

#### BIM
- **IFC** (Industry Foundation Classes): Estándar abierto BIM
- **RVT** (Revit): Formato nativo de Revit (requiere conversión)

#### 3D General
- **OBJ**: Geometría + texturas
- **FBX**: Animaciones + geometría
- **GLB/GLTF**: Web 3D estándar
- **STL**: Impresión 3D
- **PLY**: Nube de puntos

### Ejemplo de Exportación

```javascript
// Exportar a múltiples formatos
const exportProject = async (projectId, formats) => {
  const project = await getProject(projectId);
  const model3d = await load3DModel(project.model3dUrl);
  
  const exports = [];
  
  for (const format of formats) {
    let exported;
    
    switch(format) {
      case 'dwg':
        exported = await convertToCAD(model3d, 'dwg');
        break;
      case 'ifc':
        exported = await convertToBIM(model3d, 'ifc');
        break;
      case 'obj':
        exported = await convertTo3D(model3d, 'obj');
        break;
      // ... más formatos
    }
    
    exports.push({
      format,
      url: await uploadToStorage(exported, format)
    });
  }
  
  return exports;
};
```

### Conversión con Librerías Open Source

```bash
# Instalar herramientas
pip install ifcopenshell  # Para IFC (BIM)
pip install trimesh       # Para conversión 3D
pip install ezdxf         # Para DXF (CAD)
```

## 🔧 APIs y SDKs Recomendados

### Procesamiento 3D
- **Open3D**: Python library para 3D
- **PCL (Point Cloud Library)**: C++ para nubes de puntos
- **MeshLab**: Procesamiento de mallas
- **CloudCompare**: Comparación de nubes de puntos

### Visualización Web
- **Three.js**: Librería 3D para WebGL
- **Babylon.js**: Motor 3D completo
- **Potree**: Visor de nubes de puntos
- **Pannellum**: Visor 360°

### APIs Comerciales (opcionales)
- **Polycam API**: Fotogrametría cloud
- **Sketchfab API**: Hosting modelos 3D
- **Autodesk Forge**: Conversión CAD/BIM

## 📱 Desarrollo Móvil

### Permisos Requeridos

#### iOS (Info.plist)
```xml
<key>NSCameraUsageDescription</key>
<string>Necesitamos acceso a la cámara para capturar espacios</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>Guardar fotos capturadas en tu galería</string>

<key>NSLocationWhenInUseUsageDescription</key>
<string>Agregar ubicación a tus capturas</string>
```

#### Android (AndroidManifest.xml)
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

## 🚀 Deployment

### Web (Hosting)
- Firebase Hosting
- Vercel
- Netlify

### Mobile (App Stores)
- iOS: App Store Connect
- Android: Google Play Console

## 📞 Soporte

Para más información o soporte técnico, contacta al equipo de desarrollo.
