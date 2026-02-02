# 🔥 Configuración de Firebase para Su Todero D1

## Paso a Paso Completo

### 1. Crear Cuenta y Proyecto Firebase

1. Ve a https://console.firebase.google.com/
2. Haz clic en "Agregar proyecto"
3. Nombre del proyecto: `su-todero-d1` (o el que prefieras)
4. Desactiva Google Analytics (opcional)
5. Crea el proyecto

### 2. Configurar Aplicación Web

1. En el Dashboard, haz clic en el ícono **Web** (`</>`)
2. Nombre de la app: `Su Todero D1 Web`
3. **NO** marques "Firebase Hosting" por ahora
4. Haz clic en "Registrar app"
5. **COPIA** las credenciales que aparecen:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "su-todero-d1.firebaseapp.com",
  projectId: "su-todero-d1",
  storageBucket: "su-todero-d1.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc..."
};
```

6. **PEGA** estas credenciales en:
   - `shared/config/firebase.config.js` (reemplaza los valores de ejemplo)

### 3. Configurar Aplicación Android (Móvil)

1. En Firebase Console, haz clic en el ícono **Android**
2. Nombre del paquete Android: `com.sutodero.d1`
3. Descarga `google-services.json`
4. Coloca el archivo en:
   ```
   mobile/android/app/google-services.json
   ```

### 4. Configurar Aplicación iOS (Móvil)

1. En Firebase Console, haz clic en el ícono **iOS**
2. Bundle ID: `com.sutodero.d1`
3. Descarga `GoogleService-Info.plist`
4. Coloca el archivo en:
   ```
   mobile/ios/GoogleService-Info.plist
   ```

### 5. Habilitar Authentication

1. Ve a **Authentication** en el menú lateral
2. Haz clic en "Comenzar"
3. Habilita los siguientes métodos:

   **Correo electrónico/contraseña:**
   - Haz clic en "Correo electrónico/contraseña"
   - Activa el switch
   - Guarda

   **Google:**
   - Haz clic en "Google"
   - Activa el switch
   - Selecciona un email de soporte
   - Guarda

   **Apple (para iOS):**
   - Haz clic en "Apple"
   - Activa el switch
   - Guarda

### 6. Configurar Cloud Firestore

1. Ve a **Firestore Database** en el menú lateral
2. Haz clic en "Crear base de datos"
3. Selecciona **Modo de producción** (cambiaremos reglas después)
4. Ubicación: Selecciona la más cercana (ej: `us-east1`)
5. Haz clic en "Habilitar"

**Configurar Reglas de Seguridad:**

1. Ve a la pestaña **Reglas**
2. Reemplaza con estas reglas (para desarrollo):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura/escritura autenticada
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Colección de usuarios
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Colección de proyectos
    match /projects/{projectId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                     request.resource.data.userId == request.auth.uid;
    }
    
    // Colección de escaneos
    match /scans/{scanId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

3. Publica las reglas

### 7. Configurar Storage

1. Ve a **Storage** en el menú lateral
2. Haz clic en "Comenzar"
3. Selecciona **Modo de producción**
4. Ubicación: Misma que Firestore
5. Haz clic en "Listo"

**Configurar Reglas de Storage:**

1. Ve a la pestaña **Reglas**
2. Reemplaza con estas reglas:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Permitir lectura autenticada
    match /{allPaths=**} {
      allow read: if request.auth != null;
    }
    
    // Carpeta de escaneos
    match /scans/{userId}/{projectId}/{fileName} {
      allow write: if request.auth != null && 
                     request.auth.uid == userId &&
                     request.resource.size < 100 * 1024 * 1024; // Max 100MB
    }
    
    // Carpeta de fotos
    match /photos/{userId}/{fileName} {
      allow write: if request.auth != null && 
                     request.auth.uid == userId &&
                     request.resource.size < 20 * 1024 * 1024; // Max 20MB
    }
    
    // Carpeta de fotos 360
    match /photos360/{userId}/{fileName} {
      allow write: if request.auth != null && 
                     request.auth.uid == userId &&
                     request.resource.size < 50 * 1024 * 1024; // Max 50MB
    }
    
    // Carpeta de exportaciones
    match /exports/{userId}/{fileName} {
      allow write: if request.auth != null && 
                     request.auth.uid == userId &&
                     request.resource.size < 200 * 1024 * 1024; // Max 200MB
    }
  }
}
```

3. Publica las reglas

### 8. Verificar Configuración

**Para Web:**
```bash
cd web
npm install
npm run dev
```

Abre el navegador y verifica que no haya errores de Firebase en la consola.

**Para Mobile:**

Android:
```bash
cd mobile
npm install
npm run android
```

iOS:
```bash
cd mobile
npm install
cd ios && pod install && cd ..
npm run ios
```

### 9. Estructura de Datos Recomendada

**Firestore Collections:**

```
users/
  {userId}
    - email: string
    - displayName: string
    - photoURL: string
    - createdAt: timestamp
    - subscription: string

projects/
  {projectId}
    - name: string
    - userId: string
    - date: timestamp
    - status: string ('active' | 'completed')
    - storageLocation: string ('firebase' | 'local')
    - captureType: string ('photo' | 'photo360' | 'scan3d')
    - images: number
    - scans: number
    - createdAt: timestamp
    - updatedAt: timestamp

scans/
  {scanId}
    - projectId: string
    - userId: string
    - images: array<string>
    - model3dUrl: string
    - planUrl: string
    - status: string ('processing' | 'completed' | 'error')
    - createdAt: timestamp
    - processedAt: timestamp

photos/
  {photoId}
    - projectId: string
    - userId: string
    - url: string
    - type: string ('normal' | '360')
    - metadata: object
    - createdAt: timestamp
```

**Storage Structure:**

```
scans/
  {userId}/
    {projectId}/
      raw/
        - image001.jpg
        - image002.jpg
      processed/
        - image001_processed.jpg
      models/
        - model.obj
        - model.ply
        - model.glb

photos/
  {userId}/
    - photo_123456.jpg

photos360/
  {userId}/
    - pano_123456.jpg

exports/
  {userId}/
    - project_dwg_123456.dwg
    - project_ifc_123456.ifc
```

### 10. Variables de Entorno (Opcional)

Para mayor seguridad, puedes usar variables de entorno:

**Web (.env):**
```
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=su-todero-d1.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=su-todero-d1
VITE_FIREBASE_STORAGE_BUCKET=su-todero-d1.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc...
```

**Mobile (.env):**
```
FIREBASE_API_KEY=AIzaSy...
FIREBASE_AUTH_DOMAIN=su-todero-d1.firebaseapp.com
FIREBASE_PROJECT_ID=su-todero-d1
```

### 11. Testing

Crea un usuario de prueba:

1. Ve a **Authentication** > **Users**
2. Haz clic en "Agregar usuario"
3. Email: `test@sutodero.com`
4. Password: `Test123456`
5. Guarda

Usa este usuario para probar la app.

## ✅ Checklist Final

- [ ] Proyecto Firebase creado
- [ ] App Web registrada y credenciales copiadas
- [ ] App Android configurada (google-services.json)
- [ ] App iOS configurada (GoogleService-Info.plist)
- [ ] Authentication habilitada (Email, Google, Apple)
- [ ] Firestore configurado con reglas
- [ ] Storage configurado con reglas
- [ ] Usuario de prueba creado
- [ ] App web ejecutándose sin errores
- [ ] App móvil ejecutándose sin errores

## 🆘 Troubleshooting

### Error: "Default FirebaseApp failed to initialize"
- Verifica que los archivos `google-services.json` y `GoogleService-Info.plist` estén en las ubicaciones correctas
- Reconstruye el proyecto: `cd mobile && cd android && ./gradlew clean` (Android)

### Error: "Permission denied" en Storage
- Verifica las reglas de Storage
- Asegúrate de estar autenticado

### Error: "CORS" en Web
- Firebase automáticamente maneja CORS, verifica tu configuración de dominio en Firebase Console > Settings

## 📞 Soporte

Si tienes problemas, consulta:
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Native Firebase](https://rnfirebase.io/)
