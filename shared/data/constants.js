/**
 * Shared constants for Su Todero D1 data models
 */

import { firestoreCollections } from '../config/firebase.config';

export const ProjectStatus = Object.freeze({
  DRAFT: 'draft',
  ACTIVE: 'active',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
});

export const CaptureType = Object.freeze({
  PHOTO: 'photo',
  PHOTO_360: 'photo360',
  SCAN_3D: 'scan3d',
  VIDEO: 'video',
});

export const AssetType = Object.freeze({
  PLAN_2D: 'plan2d',
  MODEL_3D: 'model3d',
  TOUR_360: 'tour360',
  EXPORT: 'export',
  DOCUMENT: 'document',
});

export const ProcessingState = Object.freeze({
  PENDING: 'pending',
  QUEUED: 'queued',
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed',
});

export const ProcessingPriority = Object.freeze({
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
});

export const COLLECTIONS = Object.freeze({
  ...firestoreCollections,
});

export const DEFAULT_PROJECT_SETTINGS = Object.freeze({
  syncToCloud: true,
  autoUpload: true,
  saveLocalCopy: false,
  notifyOnProcessing: true,
});

export const DEFAULT_CAPTURE_SETTINGS = Object.freeze({
  exposure: 'auto',
  whiteBalance: 'auto',
  captureIntervalSeconds: 0,
  bracketedShots: false,
});

export default {
  ProjectStatus,
  CaptureType,
  AssetType,
  ProcessingState,
  ProcessingPriority,
  COLLECTIONS,
  DEFAULT_PROJECT_SETTINGS,
  DEFAULT_CAPTURE_SETTINGS,
};
