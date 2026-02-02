/**
 * Utilidades para manejo de almacenamiento
 * Compatible con Firebase Storage y almacenamiento local
 */

import { storageConfig } from '../config/firebase.config';

/**
 * Genera un nombre único para archivo
 */
export const generateUniqueFileName = (prefix = '', extension = '') => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `${prefix}_${timestamp}_${random}${extension ? `.${extension}` : ''}`;
};

/**
 * Obtiene la ruta de almacenamiento según el tipo de archivo
 */
export const getStoragePath = (type, userId, fileName) => {
  const folder = storageConfig.folders[type] || 'misc';
  return `${folder}/${userId}/${fileName}`;
};

/**
 * Valida el tamaño del archivo
 */
export const validateFileSize = (fileSizeBytes, type) => {
  const maxSizeMB = storageConfig.maxSizes[type] || 100;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return fileSizeBytes <= maxSizeBytes;
};

/**
 * Convierte bytes a formato legible
 */
export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Obtiene la extensión de un archivo
 */
export const getFileExtension = (fileName) => {
  return fileName.slice((fileName.lastIndexOf('.') - 1 >>> 0) + 2);
};

/**
 * Valida si el archivo es una imagen
 */
export const isImageFile = (fileName) => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
  const ext = getFileExtension(fileName).toLowerCase();
  return imageExtensions.includes(ext);
};

/**
 * Valida si el archivo es un modelo 3D
 */
export const is3DModelFile = (fileName) => {
  const modelExtensions = ['obj', 'fbx', 'ply', 'stl', 'gltf', 'glb', 'dae'];
  const ext = getFileExtension(fileName).toLowerCase();
  return modelExtensions.includes(ext);
};

/**
 * Valida si el archivo es CAD
 */
export const isCADFile = (fileName) => {
  const cadExtensions = ['dwg', 'dxf', 'dwf', 'ifc', 'rvt'];
  const ext = getFileExtension(fileName).toLowerCase();
  return cadExtensions.includes(ext);
};

export default {
  generateUniqueFileName,
  getStoragePath,
  validateFileSize,
  formatBytes,
  getFileExtension,
  isImageFile,
  is3DModelFile,
  isCADFile
};
