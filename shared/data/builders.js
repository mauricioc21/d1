/**
 * Builders for Firestore payloads
 */

import {
  ProjectStatus,
  CaptureType,
  AssetType,
  DEFAULT_PROJECT_SETTINGS,
  DEFAULT_CAPTURE_SETTINGS,
} from './constants';

const resolveTimestamp = (options = {}) => {
  if (typeof options.serverTimestamp === 'function') {
    return options.serverTimestamp();
  }
  if (options.timestamp instanceof Date) {
    return options.timestamp;
  }
  if (typeof options.timestamp === 'number') {
    return new Date(options.timestamp);
  }
  return new Date();
};

const sanitizeObject = (obj = {}) => {
  const sanitized = {};
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (value !== undefined) {
      sanitized[key] = value;
    }
  });
  return sanitized;
};

export const createProjectPayload = (input = {}, options = {}) => {
  const timestamp = resolveTimestamp(options);

  const payload = {
    name: input.name?.trim() || 'Proyecto sin título',
    description: input.description?.trim() || '',
    status: input.status || ProjectStatus.ACTIVE,
    captureMode: input.captureMode || CaptureType.PHOTO,
    location: input.location || null,
    createdBy: input.createdBy || null,
    teamMembers: input.teamMembers || [],
    coverImageUrl: input.coverImageUrl || null,
    metadata: sanitizeObject(input.metadata),
    settings: {
      ...DEFAULT_PROJECT_SETTINGS,
      ...sanitizeObject(input.settings),
    },
    metrics: {
      totalCaptures: 0,
      totalScans: 0,
      total360: 0,
      ...(input.metrics || {}),
    },
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  return payload;
};

export const updateProjectPayload = (input = {}, options = {}) => {
  const payload = sanitizeObject({
    name: input.name?.trim(),
    description: input.description?.trim(),
    status: input.status,
    captureMode: input.captureMode,
    location: input.location,
    coverImageUrl: input.coverImageUrl,
    teamMembers: input.teamMembers,
    metadata: input.metadata ? sanitizeObject(input.metadata) : undefined,
    settings: input.settings
      ? { ...DEFAULT_PROJECT_SETTINGS, ...sanitizeObject(input.settings) }
      : undefined,
    metrics: input.metrics ? { ...sanitizeObject(input.metrics) } : undefined,
  });

  return {
    ...payload,
    updatedAt: resolveTimestamp(options),
  };
};

export const createCapturePayload = (input = {}, options = {}) => {
  const timestamp = resolveTimestamp(options);

  const payload = {
    projectId: input.projectId,
    userId: input.userId,
    type: input.type || CaptureType.PHOTO,
    storagePath: input.storagePath,
    downloadURL: input.downloadURL || null,
    thumbnailURL: input.thumbnailURL || null,
    fileName: input.fileName,
    fileSize: input.fileSize || null,
    duration: input.duration || null,
    captureMetadata: {
      ...DEFAULT_CAPTURE_SETTINGS,
      ...sanitizeObject(input.captureMetadata),
    },
    processing: {
      state: input.processing?.state || 'pending',
      progress: input.processing?.progress ?? 0,
      priority: input.processing?.priority || 'normal',
      ...(input.processing?.queuedAt
        ? { queuedAt: resolveTimestamp({ timestamp: input.processing.queuedAt }) }
        : {}),
    },
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  return payload;
};

export const updateCapturePayload = (input = {}, options = {}) => {
  const payload = sanitizeObject({
    type: input.type,
    downloadURL: input.downloadURL,
    thumbnailURL: input.thumbnailURL,
    fileName: input.fileName,
    fileSize: input.fileSize,
    duration: input.duration,
    captureMetadata: input.captureMetadata
      ? { ...DEFAULT_CAPTURE_SETTINGS, ...sanitizeObject(input.captureMetadata) }
      : undefined,
    processing: input.processing
      ? {
          state: input.processing.state,
          progress: input.processing.progress,
          priority: input.processing.priority,
          startedAt: input.processing.startedAt,
          completedAt: input.processing.completedAt,
          failedAt: input.processing.failedAt,
          error: input.processing.error,
        }
      : undefined,
  });

  return {
    ...payload,
    updatedAt: resolveTimestamp(options),
  };
};

export const createAssetPayload = (input = {}, options = {}) => {
  const timestamp = resolveTimestamp(options);

  const payload = {
    projectId: input.projectId,
    captureId: input.captureId || null,
    type: input.type || AssetType.PLAN_2D,
    format: input.format || null,
    version: input.version || 1,
    storagePath: input.storagePath,
    downloadURL: input.downloadURL || null,
    previewURL: input.previewURL || null,
    metadata: sanitizeObject(input.metadata),
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  return payload;
};

export const updateAssetPayload = (input = {}, options = {}) => {
  const payload = sanitizeObject({
    type: input.type,
    format: input.format,
    version: input.version,
    downloadURL: input.downloadURL,
    previewURL: input.previewURL,
    metadata: input.metadata ? sanitizeObject(input.metadata) : undefined,
  });

  return {
    ...payload,
    updatedAt: resolveTimestamp(options),
  };
};

export default {
  createProjectPayload,
  updateProjectPayload,
  createCapturePayload,
  updateCapturePayload,
  createAssetPayload,
  updateAssetPayload,
};
