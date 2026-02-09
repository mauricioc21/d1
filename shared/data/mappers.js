/**
 * Firestore document mappers for Su Todero D1
 */

import {
  ProjectStatus,
  CaptureType,
  AssetType,
} from './constants';

const normalizeTimestamp = (value) => {
  if (!value) return null;
  if (typeof value.toDate === 'function') {
    return value.toDate();
  }
  if (value instanceof Date) {
    return value;
  }
  const parsed = Number(value);
  if (!Number.isNaN(parsed)) {
    return new Date(parsed);
  }
  return new Date(value);
};

const extractDocData = (doc) => {
  if (!doc) return {};
  if (typeof doc.data === 'function') {
    return doc.data();
  }
  return doc;
};

export const mapProjectDoc = (doc) => {
  const data = extractDocData(doc);

  if (!data) {
    return null;
  }

  return {
    id: doc?.id || data.id || null,
    name: data.name || 'Proyecto sin título',
    description: data.description || '',
    status: data.status || ProjectStatus.ACTIVE,
    captureMode: data.captureMode || CaptureType.PHOTO,
    location: data.location || null,
    coverImageUrl: data.coverImageUrl || null,
    metrics: {
      totalCaptures: data.metrics?.totalCaptures ?? data.totalCaptures ?? 0,
      totalScans: data.metrics?.totalScans ?? data.totalScans ?? 0,
      total360: data.metrics?.total360 ?? data.total360 ?? 0,
    },
    totalCaptures: data.metrics?.totalCaptures ?? data.totalCaptures ?? 0,
    totalScans: data.metrics?.totalScans ?? data.totalScans ?? 0,
    total360: data.metrics?.total360 ?? data.total360 ?? 0,
    planOutputs: data.planOutputs || [],
    createdAt: normalizeTimestamp(data.createdAt),
    updatedAt: normalizeTimestamp(data.updatedAt),
    createdBy: data.createdBy || null,
    teamMembers: data.teamMembers || [],
    settings: {
      autoUpload: data?.settings?.autoUpload ?? true,
      syncToCloud: data?.settings?.syncToCloud ?? true,
      saveLocalCopy: data?.settings?.saveLocalCopy ?? false,
      notifyOnProcessing: data?.settings?.notifyOnProcessing ?? true,
    },
    metadata: {
      ...data.metadata,
    },
  };
};

export const mapCaptureDoc = (doc) => {
  const data = extractDocData(doc);

  if (!data) {
    return null;
  }

  return {
    id: doc?.id || data.id || null,
    projectId: data.projectId,
    userId: data.userId,
    type: data.type || CaptureType.PHOTO,
    storagePath: data.storagePath,
    downloadURL: data.downloadURL || null,
    thumbnailURL: data.thumbnailURL || null,
    fileName: data.fileName || null,
    fileSize: data.fileSize || null,
    duration: data.duration || null,
    captureMetadata: data.captureMetadata || {},
    processing: {
      state: data?.processing?.state || 'pending',
      progress: data?.processing?.progress ?? 0,
      priority: data?.processing?.priority || 'normal',
      updatedAt: normalizeTimestamp(data?.processing?.updatedAt),
    },
    createdAt: normalizeTimestamp(data.createdAt),
    updatedAt: normalizeTimestamp(data.updatedAt),
  };
};

export const mapAssetDoc = (doc) => {
  const data = extractDocData(doc);

  if (!data) {
    return null;
  }

  return {
    id: doc?.id || data.id || null,
    projectId: data.projectId,
    captureId: data.captureId || null,
    type: data.type || AssetType.PLAN_2D,
    format: data.format || null,
    version: data.version || 1,
    storagePath: data.storagePath,
    downloadURL: data.downloadURL || null,
    previewURL: data.previewURL || null,
    metadata: data.metadata || {},
    createdAt: normalizeTimestamp(data.createdAt),
    updatedAt: normalizeTimestamp(data.updatedAt),
  };
};

export default {
  mapProjectDoc,
  mapCaptureDoc,
  mapAssetDoc,
};
