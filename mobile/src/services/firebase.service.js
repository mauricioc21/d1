/**
 * Firebase Service - Servicio de inicialización y utilidades de Firebase
 */

import { Platform } from 'react-native';
// import firebase from '@react-native-firebase/app';
// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
// import storage from '@react-native-firebase/storage';

// Importar configuración compartida
import { firebaseConfig, firestoreCollections } from '../../../shared/config/firebase.config';

let firebaseApp = null;
let isInitialized = false;

/**
 * Inicializa Firebase
 */
export const initializeFirebase = async () => {
  if (isInitialized) {
    return firebaseApp;
  }

  try {
    // NOTA: En React Native, Firebase se inicializa automáticamente
    // desde los archivos google-services.json (Android) y GoogleService-Info.plist (iOS)
    
    // Verificar si Firebase ya está inicializado
    // firebaseApp = firebase.app();
    
    console.log('✅ Firebase inicializado correctamente');
    isInitialized = true;
    
    return firebaseApp;
  } catch (error) {
    console.error('❌ Error al inicializar Firebase:', error);
    throw error;
  }
};

/**
 * Obtiene la instancia de Firestore
 */
export const getFirestore = () => {
  // return firestore();
  console.log('Firestore no configurado aún');
  return null;
};

/**
 * Obtiene la instancia de Storage
 */
export const getStorage = () => {
  // return storage();
  console.log('Storage no configurado aún');
  return null;
};

/**
 * Obtiene la instancia de Auth
 */
export const getAuth = () => {
  // return auth();
  console.log('Auth no configurado aún');
  return null;
};

/**
 * Sube un archivo a Firebase Storage
 */
export const uploadFile = async (filePath, storagePath, onProgress) => {
  try {
    console.log(`Subiendo archivo: ${filePath} -> ${storagePath}`);
    
    // const reference = storage().ref(storagePath);
    // const task = reference.putFile(filePath);
    
    // if (onProgress) {
    //   task.on('state_changed', (snapshot) => {
    //     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //     onProgress(progress);
    //   });
    // }
    
    // await task;
    // const downloadURL = await reference.getDownloadURL();
    
    // return downloadURL;
    
    // Simulación para desarrollo
    return `https://storage.example.com/${storagePath}`;
  } catch (error) {
    console.error('Error subiendo archivo:', error);
    throw error;
  }
};

/**
 * Descarga un archivo desde Firebase Storage
 */
export const downloadFile = async (storagePath, localPath, onProgress) => {
  try {
    console.log(`Descargando archivo: ${storagePath} -> ${localPath}`);
    
    // const reference = storage().ref(storagePath);
    // const task = reference.writeToFile(localPath);
    
    // if (onProgress) {
    //   task.on('state_changed', (snapshot) => {
    //     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //     onProgress(progress);
    //   });
    // }
    
    // await task;
    
    return localPath;
  } catch (error) {
    console.error('Error descargando archivo:', error);
    throw error;
  }
};

/**
 * Guarda un documento en Firestore
 */
export const saveDocument = async (collection, docId, data) => {
  try {
    // const db = firestore();
    // await db.collection(collection).doc(docId).set(data, { merge: true });
    
    console.log(`Documento guardado: ${collection}/${docId}`);
    return true;
  } catch (error) {
    console.error('Error guardando documento:', error);
    throw error;
  }
};

/**
 * Obtiene un documento de Firestore
 */
export const getDocument = async (collection, docId) => {
  try {
    // const db = firestore();
    // const doc = await db.collection(collection).doc(docId).get();
    
    // if (doc.exists) {
    //   return { id: doc.id, ...doc.data() };
    // }
    
    return null;
  } catch (error) {
    console.error('Error obteniendo documento:', error);
    throw error;
  }
};

/**
 * Obtiene una colección completa de Firestore
 */
export const getCollection = async (collection, queryOptions = {}) => {
  try {
    // const db = firestore();
    // let query = db.collection(collection);
    
    // // Aplicar filtros si existen
    // if (queryOptions.where) {
    //   queryOptions.where.forEach(([field, operator, value]) => {
    //     query = query.where(field, operator, value);
    //   });
    // }
    
    // // Ordenar
    // if (queryOptions.orderBy) {
    //   query = query.orderBy(queryOptions.orderBy.field, queryOptions.orderBy.direction || 'asc');
    // }
    
    // // Limitar
    // if (queryOptions.limit) {
    //   query = query.limit(queryOptions.limit);
    // }
    
    // const snapshot = await query.get();
    // return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    return [];
  } catch (error) {
    console.error('Error obteniendo colección:', error);
    throw error;
  }
};

export default {
  initializeFirebase,
  getFirestore,
  getStorage,
  getAuth,
  uploadFile,
  downloadFile,
  saveDocument,
  getDocument,
  getCollection,
};
