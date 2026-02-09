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
  // Configuración para el proyecto d1sutodero
  // Credenciales completas desde Firebase Console
  apiKey: "AIzaSyBRANDpxMj0z_MD0aX-lqwB6Xpqy9U8HhA",
  authDomain: "d1sutodero.firebaseapp.com",
  projectId: "d1sutodero",
  storageBucket: "d1sutodero.firebasestorage.app",
  messagingSenderId: "546754739782",
  appId: "1:546754739782:web:786b8cc0e0b04fd2b69447",
  measurementId: "G-GC2TRXBS03"
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
  captures: 'captures',
  scans: 'scans',
  photos: 'photos',
  plans: 'plans'
};

export default firebaseConfig;
