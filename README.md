# Su Todero D1 🏗️📐

> Aplicación multiplataforma para escaneo 3D, captura 360° y generación de planos CAD/BIM

> **🔥 Proyecto Firebase:** `Sutoderoapp` - [Ver guía de configuración](docs/SUTODEROAPP_CONFIG.md)

> **🎨 Diseño:** Negro, Blanco y Dorado - Elegante y Profesional - [Ver guía de marca](docs/BRAND_GUIDE.md)

## 🌟 Características

- 📱 **App Móvil** (iOS & Android) - React Native
- 🌐 **Aplicación Web** - React + Three.js
- 📷 **Captura 360°** - Soporte para cámaras Insta360 y más
- 🏠 **Escaneo 3D** - Captura espacios con cámara del celular o cámaras especializadas
- 🗺️ **Planos 2D/3D** - Generación automática de planos
- 🚶 **Recorridos Virtuales** - Navegación inmersiva
- 💾 **Almacenamiento Flexible** - Firebase o dispositivo local
- 📤 **Exportación CAD/BIM** - Formatos DWG, IFC, OBJ, PLY

## 📂 Estructura del Proyecto

```
su-todero-d1/
├── mobile/          # App React Native (iOS/Android)
├── web/            # Aplicación web React
├── shared/         # Código compartido
│   ├── config/    # Configuraciones (Firebase, etc)
│   └── utils/     # Utilidades compartidas
└── docs/          # Documentación
```

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ 
- npm o yarn
- Para móvil: 
  - iOS: Xcode, CocoaPods
  - Android: Android Studio, JDK

### Instalación

#### 1. App Móvil

```bash
cd mobile
npm install
# Para iOS
cd ios && pod install && cd ..
npm run ios
# Para Android
npm run android
```

#### 2. Aplicación Web

```bash
cd web
npm install
npm run dev
```

## 🔥 Configuración de Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
   - Proyecto: **Sutoderoapp** (o usa el proyecto existente)
2. Activa:
   - Authentication (Email/Google)
   - Cloud Firestore
   - Storage
3. Copia las credenciales en `shared/config/firebase.config.js`

## 📸 Cámaras Soportadas

- Cámaras de smartphone (iOS/Android)
- Insta360 ONE X, X2, X3
- Insta360 ONE RS
- Ricoh Theta (próximamente)
- LiDAR (iPhone Pro/iPad Pro)

## 🛠️ Stack Tecnológico

### Mobile
- React Native 0.73+
- React Native Camera / Vision Camera
- React Native FS (almacenamiento local)
- Firebase SDK

### Web
- React 18+
- Three.js / React Three Fiber
- Pannellum (visor 360°)
- Potree (nubes de puntos)

### Backend/Procesamiento
- Firebase Functions
- Open3D (Python - procesamiento 3D)
- OpenCV (procesamiento de imágenes)
- COLMAP (fotogrametría)

## 📖 Documentación

Ver carpeta `docs/` para:
- Guía de arquitectura
- API reference
- Tutoriales de integración
- Casos de uso

## 🤝 Contribución

Este es un proyecto privado. Para contribuir, contacta al equipo de desarrollo.

## 📄 Licencia

Propiedad privada - Todos los derechos reservados

## 👥 Equipo

Su Todero D1 Development Team

---

**Versión**: 1.0.0  
**Última actualización**: 2026-02-02
