/**
 * Configuración de Firebase para Su Todero D1
 * 
 * INSTRUCCIONES:
 * 1. Ve a https://console.firebase.google.com/
 * 2. Crea un nuevo proyecto o selecciona uno existente
 * 3. Ve a Configuración del proyecto > Tus aplicaciones
 * 4. Crea una app web y copia las credenciales aquí
 * 5. Activa los siguientes servicios:
 *    - Authentication (Email/Password y Google)
 *    - Cloud Firestore
 *    - Storage
 */

export const firebaseConfig = {
  // TODO: Reemplaza con tus credenciales de Firebase
  apiKey: "TU_API_KEY_AQUI",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456",
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
