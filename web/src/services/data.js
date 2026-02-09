/**
 * Web data layer wrappers using shared Firebase helpers
 */

import firebase from 'firebase/compat/app'

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
} from '@shared/data'

import { firestore } from './firebase'

const serverTimestamp = () => firebase.firestore.FieldValue.serverTimestamp()

const withServerTimestamp = (options = {}) => {
  if (options.serverTimestamp) {
    return options
  }

  return {
    ...options,
    serverTimestamp,
  }
}

// Projects
export const createProject = (data, options = {}) =>
  sharedCreateProject(firestore, data, withServerTimestamp(options))

export const updateProject = (projectId, updates, options = {}) =>
  sharedUpdateProject(firestore, projectId, updates, withServerTimestamp(options))

export const deleteProject = (projectId, options = {}) =>
  sharedDeleteProject(firestore, projectId, withServerTimestamp(options))

export const getProjectById = (projectId) => sharedGetProjectById(firestore, projectId)

export const listProjectsByUser = (userId, options = {}) =>
  sharedListProjectsByUser(firestore, userId, options)

export const listenProjectsByUser = (userId, callback, options = {}) =>
  sharedListenProjectsByUser(firestore, userId, callback, options)

export const incrementProjectMetrics = (projectId, counters, options = {}) =>
  sharedIncrementProjectMetrics(firestore, projectId, counters, withServerTimestamp(options))

// Captures
export const createCapture = (data, options = {}) =>
  sharedCreateCapture(firestore, data, withServerTimestamp(options))

export const updateCapture = (captureId, updates, options = {}) =>
  sharedUpdateCapture(firestore, captureId, updates, withServerTimestamp(options))

export const deleteCapture = (captureId, options = {}) =>
  sharedDeleteCapture(firestore, captureId, withServerTimestamp(options))

export const listCapturesByProject = (projectId, options = {}) =>
  sharedListCapturesByProject(firestore, projectId, options)

export const listenCapturesByProject = (projectId, callback, options = {}) =>
  sharedListenCapturesByProject(firestore, projectId, callback, options)

export const listCapturesByUser = (userId, options = {}) =>
  sharedListCapturesByUser(firestore, userId, options)

// Assets
export const createAsset = (data, options = {}) =>
  sharedCreateAsset(firestore, data, withServerTimestamp(options))

export const updateAsset = (assetId, updates, options = {}) =>
  sharedUpdateAsset(firestore, assetId, updates, withServerTimestamp(options))

export const deleteAsset = (assetId) => sharedDeleteAsset(firestore, assetId)

export const listAssetsByProject = (projectId, options = {}) =>
  sharedListAssetsByProject(firestore, projectId, options)

export const listenAssetsByProject = (projectId, callback, options = {}) =>
  sharedListenAssetsByProject(firestore, projectId, callback, options)

export default {
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
  listCapturesByProject,
  listenCapturesByProject,
  listCapturesByUser,
  createAsset,
  updateAsset,
  deleteAsset,
  listAssetsByProject,
  listenAssetsByProject,
}
