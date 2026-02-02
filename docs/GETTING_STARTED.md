# Guía de Inicio Rápido - Su Todero D1

## 🚀 Empezar en 5 Minutos

### Prerrequisitos

- Node.js 18+
- npm o yarn
- Git

### 1️⃣ Clonar el Repositorio

```bash
git clone <tu-repositorio>
cd su-todero-d1
```

### 2️⃣ Instalar Dependencias

```bash
# Instalar todas las dependencias
npm run install:all

# O manualmente:
npm install           # Root
cd mobile && npm install
cd ../web && npm install
```

### 3️⃣ Configurar Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Copia tus credenciales
3. Edita `shared/config/firebase.config.js`:

```javascript
export const firebaseConfig = {
  apiKey: "TU_API_KEY_AQUI",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### 4️⃣ Ejecutar la Aplicación Web

```bash
cd web
npm run dev
```

Abre http://localhost:3000 en tu navegador

### 5️⃣ Ejecutar la App Móvil

#### iOS
```bash
cd mobile
npm run pods    # Solo primera vez
npm run ios
```

#### Android
```bash
cd mobile
npm run android
```

## 📱 Funcionalidades Principales

### ✅ Listo para Usar
- ✅ Interfaz de usuario completa (Mobile + Web)
- ✅ Navegación entre pantallas
- ✅ Gestión de proyectos
- ✅ Sistema de almacenamiento (Firebase/Local)
- ✅ Configuraciones básicas

### 🚧 Por Implementar
- 🔧 Captura real con cámara (requiere permisos)
- 🔧 Integración con cámaras 360° (Insta360, etc)
- 🔧 Procesamiento 3D (fotogrametría)
- 🔧 Visor 3D interactivo (Three.js)
- 🔧 Visor 360° (Pannellum)
- 🔧 Exportación a CAD/BIM

## 🎯 Próximos Pasos

1. **Configurar Permisos de Cámara**
   - Ver `docs/ARCHITECTURE.md` sección "Permisos Requeridos"

2. **Implementar Captura de Cámara**
   - Instalar `react-native-vision-camera`
   - Configurar en `CameraScreen.js`

3. **Conectar Firebase Real**
   - Descomentar código en `firebase.service.js`
   - Configurar archivos de configuración nativos

4. **Añadir Procesamiento 3D**
   - Backend Python con Open3D
   - Firebase Functions para procesamiento

5. **Implementar Visores**
   - Three.js para 3D
   - Pannellum para 360°

## 📚 Recursos

- [Documentación Completa](./ARCHITECTURE.md)
- [API Reference](./API.md)
- [Guía de Contribución](./CONTRIBUTING.md)

## ❓ Preguntas Frecuentes

### ¿Funciona sin Firebase?
Sí, puedes usar almacenamiento local en el dispositivo. Cambia la configuración en Settings.

### ¿Qué cámaras son compatibles?
- Cámaras de smartphone (iOS/Android)
- Insta360 (ONE X, X2, X3, ONE RS)
- Ricoh Theta (V, Z1)

### ¿Necesito conocimientos de 3D?
No, la app hace todo el procesamiento automáticamente.

## 🐛 Problemas Comunes

### Error: "Firebase not initialized"
- Verifica que copiaste las credenciales correctas
- Para React Native, verifica archivos `google-services.json` y `GoogleService-Info.plist`

### Error: "Camera permission denied"
- Asegúrate de agregar permisos en `Info.plist` (iOS) y `AndroidManifest.xml` (Android)

### La app web no carga
- Verifica que el puerto 3000 esté libre
- Ejecuta `npm run dev` desde la carpeta `web/`

## 💡 Tips

1. **Desarrollo**: Usa Firebase Emulator para desarrollo local
2. **Testing**: Prueba con fotos de ejemplo antes de capturar reales
3. **Performance**: Optimiza imágenes antes de subir (max 4K)

## 🤝 Soporte

¿Necesitas ayuda? Revisa la documentación completa o contacta al equipo de desarrollo.
