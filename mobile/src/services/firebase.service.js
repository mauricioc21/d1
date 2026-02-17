/**
 * Firebase Service - Servicio de inicialización y utilidades de Firebase
 */

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import firebase from '@react-native-firebase/app';

// Importar configuración compartida (utilizada si necesitamos inicializar manualmente)
import { firebaseConfig } from '../../../shared/config/firebase.config';
import {
  createProject as sharedCreateProject,
  updateProject as sharedUpdateProject,
  deleteProject as sharedDeleteProject,
  getProjectById as sharedGetProjectById,
  listProjectsByUser as sharedListProjectsByUser,
  listenProjectsByUser as sharedListenProjectsByUser,
  incrementProjectMetrics as sharedIncrementProjectMetrics,
  createCapture as sharedCreateCapture,
  updateCapture as sharedUpdateCapture,
  deleteCapture as sharedDeleteCapture,
  listCapturesByProject as sharedListCapturesByProject,
  listenCapturesByProject as sharedListenCapturesByProject,
  listCapturesByUser as sharedListCapturesByUser,
  createAsset as sharedCreateAsset,
  updateAsset as sharedUpdateAsset,
  deleteAsset as sharedDeleteAsset,
  listAssetsByProject as sharedListAssetsByProject,
  listenAssetsByProject as sharedListenAssetsByProject,
} from '../../../shared/data';

let firebaseApp = null;
let isInitialized = false;

const getServerTimestampFn = () => {
  const fieldValue = firestore.FieldValue;
  if (fieldValue && typeof fieldValue.serverTimestamp === 'function') {
    return () => fieldValue.serverTimestamp();
  }
  return () => new Date();
};

const withServerTimestamp = (options = {}) => {
  if (options.serverTimestamp) {
    return options;
  }
  return {
    ...options,
    serverTimestamp: getServerTimestampFn(),
  };
};

const ensureInitialized = () => {
  if (isInitialized && firebaseApp) {
    return firebaseApp;
  }

  try {
    firebaseApp = firebase.app();
    isInitialized = true;
    return firebaseApp;
  } catch (error) {
    // Si la app no está inicializada (caso poco común en RN), intentamos crearla
    firebaseApp = firebase.initializeApp(firebaseConfig);
    isInitialized = true;
    return firebaseApp;
  }
};

/**
 * Inicializa Firebase (idempotente)
 */
export const initializeFirebase = async () => {
  try {
    const appInstance = ensureInitialized();
    console.log('✅ Firebase inicializado correctamente');
    return appInstance;
  } catch (error) {
    console.error('❌ Error al inicializar Firebase:', error);
    throw error;
  }
};

/**
 * Obtiene la instancia de Firestore
 */
export const getFirestore = () => {
  ensureInitialized();
  return firestore();
};

/**
 * Obtiene la instancia de Storage
 */
export const getStorage = () => {
  ensureInitialized();
  return storage();
};

/**
 * Obtiene la instancia de Auth
 */
export const getAuth = () => {
  ensureInitialized();
  return auth();
};

/**
 * Sube un archivo a Firebase Storage
 */
export const uploadFile = async (filePath, storagePath, onProgress) => {
  try {
    const storageInstance = getStorage();
    const reference = storageInstance.ref(storagePath);
    const task = reference.putFile(filePath);

    if (onProgress) {
      task.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(progress);
      });
    }

    await task;
    const downloadURL = await reference.getDownloadURL();
    return downloadURL;
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
    const storageInstance = getStorage();
    const reference = storageInstance.ref(storagePath);
    const task = reference.writeToFile(localPath);

    if (onProgress) {
      task.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(progress);
      });
    }

    await task;
    return localPath;
  } catch (error) {
    console.error('Error descargando archivo:', error);
    throw error;
  }
};

/**
 * Guarda un documento en Firestore
 */
export const saveDocument = async (collectionName, docId, data) => {
  try {
    const db = getFirestore();
    await db.collection(collectionName).doc(docId).set(data, { merge: true });
    return true;
  } catch (error) {
    console.error('Error guardando documento:', error);
    throw error;
  }
};

/**
 * Obtiene un documento de Firestore
 */
export const getDocument = async (collectionName, docId) => {
  try {
    const db = getFirestore();
    const doc = await db.collection(collectionName).doc(docId).get();

    if (doc.exists) {
      return { id: doc.id, ...doc.data() };
    }

    return null;
  } catch (error) {
    console.error('Error obteniendo documento:', error);
    throw error;
  }
};

/**
 * Obtiene una colección completa de Firestore
 */
export const getCollection = async (collectionName, queryOptions = {}) => {
  try {
    const db = getFirestore();
    let collectionQuery = db.collection(collectionName);

    if (queryOptions.where) {
      queryOptions.where.forEach(([field, operator, value]) => {
        collectionQuery = collectionQuery.where(field, operator, value);
      });
    }

    if (queryOptions.orderBy) {
      const { field, direction = 'asc' } = queryOptions.orderBy;
      collectionQuery = collectionQuery.orderBy(field, direction);
    }

    if (queryOptions.limit) {
      collectionQuery = collectionQuery.limit(queryOptions.limit);
    }

    const snapshot = await collectionQuery.get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error obteniendo colección:', error);
    throw error;
  }
};

// Projects API (wrap shared data layer)
export const createProject = async (data, options = {}) => {
  const db = getFirestore();
  return sharedCreateProject(db, data, withServerTimestamp(options));
};

export const updateProject = async (projectId, updates, options = {}) => {
  const db = getFirestore();
  return sharedUpdateProject(db, projectId, updates, withServerTimestamp(options));
};

export const deleteProject = async (projectId, options = {}) => {
  const db = getFirestore();
  return sharedDeleteProject(db, projectId, withServerTimestamp(options));
};

export const getProjectById = async (projectId) => {
  const db = getFirestore();
  return sharedGetProjectById(db, projectId);
};

export const listProjectsByUser = async (userId, options = {}) => {
  const db = getFirestore();
  return sharedListProjectsByUser(db, userId, options);
};

export const listenProjectsByUser = (userId, callback, options = {}) => {
  const db = getFirestore();
  return sharedListenProjectsByUser(db, userId, callback, options);
};

export const incrementProjectMetrics = async (projectId, counters, options = {}) => {
  const db = getFirestore();
  return sharedIncrementProjectMetrics(db, projectId, counters, withServerTimestamp(options));
};

// Captures API
export const createCapture = async (data, options = {}) => {
  const db = getFirestore();
  return sharedCreateCapture(db, data, withServerTimestamp(options));
};

export const updateCapture = async (captureId, updates, options = {}) => {
  const db = getFirestore();
  return sharedUpdateCapture(db, captureId, updates, withServerTimestamp(options));
};

export const deleteCapture = async (captureId, options = {}) => {
  const db = getFirestore();
  return sharedDeleteCapture(db, captureId, withServerTimestamp(options));
};

export const listCapturesForProject = async (projectId, options = {}) => {
  const db = getFirestore();
  return sharedListCapturesByProject(db, projectId, options);
};

export const listenCapturesForProject = (projectId, callback, options = {}) => {
  const db = getFirestore();
  return sharedListenCapturesByProject(db, projectId, callback, options);
};

export const listCapturesForUser = async (userId, options = {}) => {
  const db = getFirestore();
  return sharedListCapturesByUser(db, userId, options);
};

// Assets API
export const createAsset = async (data, options = {}) => {
  const db = getFirestore();
  return sharedCreateAsset(db, data, withServerTimestamp(options));
};

export const updateAsset = async (assetId, updates, options = {}) => {
  const db = getFirestore();
  return sharedUpdateAsset(db, assetId, updates, withServerTimestamp(options));
};

export const deleteAsset = async (assetId) => {
  const db = getFirestore();
  return sharedDeleteAsset(db, assetId);
};

export const listAssetsForProject = async (projectId, options = {}) => {
  const db = getFirestore();
  return sharedListAssetsByProject(db, projectId, options);
};

export const listenAssetsForProject = (projectId, callback, options = {}) => {
  const db = getFirestore();
  return sharedListenAssetsByProject(db, projectId, callback, options);
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
  createProject,
  updateProject,
  deleteProject,
  getProjectById,
  listProjectsByUser,
  listenProjectsByUser,
  incrementProjectMetrics,
  createCapture,
  updateCapture,
  deleteCapture,
  listCapturesForProject,
  listenCapturesForProject,
  listCapturesForUser,
  createAsset,
  updateAsset,
  deleteAsset,
  listAssetsForProject,
  listenAssetsForProject,
};
