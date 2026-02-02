/**
 * Configuración de Firebase para Su Todero D1
 * Proyecto Firebase: Sutoderoapp
 * 
 * INSTRUCCIONES RÁPIDAS:
 * 1. Ve a: https://console.firebase.google.com/project/sutoderoapp/settings/general
 * 2. Baja hasta "Tus aplicaciones" > App Web
 * 3. Copia las credenciales del objeto firebaseConfig
 * 4. Reemplaza los valores a continuación con tus credenciales reales
 * 
 * GUÍA COMPLETA: Ver docs/SUTODEROAPP_CONFIG.md
 */

export const firebaseConfig = {
  // Configuración para el proyecto Sutoderoapp
  // NOTA: Obtén las credenciales reales desde Firebase Console:
  // https://console.firebase.google.com/project/sutoderoapp/settings/general
  apiKey: "TU_API_KEY_AQUI",
  authDomain: "sutoderoapp.firebaseapp.com",
  projectId: "sutoderoapp",
  storageBucket: "sutoderoapp.appspot.com",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID_AQUI",
  measurementId: "G-XXXXXXXXXX"
};

// Configuración de Storage
export const storageConfig = {
  // Carpetas en Firebase Storage
  folders: {
    scans: 'scans',           // Escaneos 3D
    photos: 'photos',         // Fotos normales
    photos360: 'photos360',   // Fotos 360°
    plans: 'plans',           // Planos generados
    exports: 'exports'        // Archivos CAD/BIM exportados
  },
  
  // Tamaños máximos de archivos (en MB)
  maxSizes: {
    photo: 20,
    photo360: 50,
    scan: 200,
    video: 500
  }
};

// Configuración de Firestore
export const firestoreCollections = {
  users: 'users',
  projects: 'projects',
  scans: 'scans',
  photos: 'photos',
  plans: 'plans'
};

export default firebaseConfig;
