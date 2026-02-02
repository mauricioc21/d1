# 🔥 Configuración Rápida para Sutoderoapp

## ⚡ Acceso Rápido

**Firebase Console:** https://console.firebase.google.com/project/d1sutodero

---

## 📋 Pasos para Obtener Credenciales

### 1. Acceder al Proyecto

1. Ve a: https://console.firebase.google.com/project/d1sutodero/settings/general
2. Baja hasta la sección "Tus aplicaciones"

### 2. Configurar App Web

Si no tienes una app web registrada:

1. Haz clic en el icono **</>** (Web)
2. Nombre de la app: `Su Todero D1 Web`
3. Haz clic en "Registrar app"
4. **COPIA** el objeto `firebaseConfig`:

```javascript
const firebaseConfig = {
  apiKey: "...",
  authDomain: "d1sutodero.firebaseapp.com",
  projectId: "d1sutodero",
  storageBucket: "d1sutodero.appspot.com",
  messagingSenderId: "...",
  appId: "...",
  measurementId: "..."
};
```

5. **PEGA** estas credenciales en: `shared/config/firebase.config.js`

### 3. Configurar App Android

1. En Firebase Console, ve a: **Configuración del proyecto > Tus aplicaciones**
2. Haz clic en el icono de **Android**
3. Nombre del paquete Android: `com.sutodero.d1`
4. Descarga el archivo `google-services.json`
5. Colócalo en: `mobile/android/app/google-services.json`

### 4. Configurar App iOS

1. En Firebase Console, ve a: **Configuración del proyecto > Tus aplicaciones**
2. Haz clic en el icono de **iOS**
3. Bundle ID de iOS: `com.sutodero.d1`
4. Descarga el archivo `GoogleService-Info.plist`
5. Colócalo en: `mobile/ios/GoogleService-Info.plist`

---

## ✅ Verificar Servicios Habilitados

### Authentication
- URL: https://console.firebase.google.com/project/d1sutodero/authentication
- Métodos habilitados:
  - ✅ Correo electrónico/contraseña
  - ✅ Google
  - ✅ Apple (para iOS)

### Firestore Database
- URL: https://console.firebase.google.com/project/d1sutodero/firestore
- Modo: Producción
- Reglas de seguridad configuradas

### Storage
- URL: https://console.firebase.google.com/project/d1sutodero/storage
- Estructura de carpetas:
  ```
  /scans/
  /photos/
  /photos360/
  /plans/
  /exports/
  ```

---

## 📝 Plantilla de Configuración

Copia esto en `shared/config/firebase.config.js`:

```javascript
/**
 * Configuración de Firebase para Su Todero D1
 * Proyecto: Sutoderoapp
 */

export const firebaseConfig = {
  apiKey: "PEGA_AQUI_TU_API_KEY",
  authDomain: "d1sutodero.firebaseapp.com",
  projectId: "d1sutodero",
  storageBucket: "d1sutodero.appspot.com",
  messagingSenderId: "PEGA_AQUI_TU_MESSAGING_SENDER_ID",
  appId: "PEGA_AQUI_TU_APP_ID",
  measurementId: "PEGA_AQUI_TU_MEASUREMENT_ID"
};

// No cambies el resto del archivo
export const storageConfig = {
  folders: {
    scans: 'scans',
    photos: 'photos',
    photos360: 'photos360',
    plans: 'plans',
    exports: 'exports'
  },
  maxSizes: {
    photo: 20,
    photo360: 50,
    scan: 200,
    video: 500
  }
};

export const firestoreCollections = {
  users: 'users',
  projects: 'projects',
  scans: 'scans',
  photos: 'photos',
  plans: 'plans'
};

export default firebaseConfig;
```

---

## 🧪 Probar la Configuración

### Web
```bash
cd web
npm install
npm run dev
```

Abre http://localhost:3000 y verifica la consola del navegador:
- ✅ No debe haber errores de Firebase
- ✅ Debe conectarse correctamente

### Mobile

**Android:**
```bash
cd mobile
npm install
npm run android
```

**iOS:**
```bash
cd mobile
npm install
cd ios && pod install && cd ..
npm run ios
```

---

## 🔑 Información Importante

### Proyecto Firebase
- **Nombre:** Sutoderoapp
- **ID:** d1sutodero
- **Región:** (verifica en Firebase Console)

### Bundle IDs
- **Android:** `com.sutodero.d1`
- **iOS:** `com.sutodero.d1`

### URLs de Administración
- Dashboard: https://console.firebase.google.com/project/d1sutodero
- Authentication: https://console.firebase.google.com/project/d1sutodero/authentication
- Firestore: https://console.firebase.google.com/project/d1sutodero/firestore
- Storage: https://console.firebase.google.com/project/d1sutodero/storage
- Settings: https://console.firebase.google.com/project/d1sutodero/settings/general

---

## ⚠️ Seguridad

### NO Subas a Git:
- ✅ `.gitignore` ya está configurado
- ❌ NO subas archivos con credenciales reales
- ❌ NO compartas API keys públicamente

### Archivos Sensibles:
```
mobile/android/app/google-services.json
mobile/ios/GoogleService-Info.plist
.env
```

---

## 🆘 Problemas Comunes

### Error: "Firebase project not found"
➡️ Verifica que el `projectId` sea exactamente: `d1sutodero`

### Error: "Authentication failed"
➡️ Verifica que los métodos de autenticación estén habilitados en Firebase Console

### Error: "Permission denied" en Storage
➡️ Configura las reglas de Storage (ver `docs/FIREBASE_SETUP.md`)

---

## ✅ Checklist de Configuración

- [ ] Credenciales de Firebase copiadas en `shared/config/firebase.config.js`
- [ ] `google-services.json` en `mobile/android/app/`
- [ ] `GoogleService-Info.plist` en `mobile/ios/`
- [ ] Authentication habilitada (Email, Google, Apple)
- [ ] Firestore creado con reglas configuradas
- [ ] Storage creado con carpetas configuradas
- [ ] App web ejecutándose sin errores
- [ ] App móvil ejecutándose sin errores

---

## 📞 Siguiente Paso

Una vez completada la configuración, sigue con:
1. `docs/GETTING_STARTED.md` - Para ejecutar la app
2. `docs/ARCHITECTURE.md` - Para entender la estructura
3. `docs/API.md` - Para usar los servicios

---

**Proyecto:** Su Todero D1  
**Firebase:** Sutoderoapp  
**Última actualización:** 2026-02-02
