/**
 * Cross-platform Firestore helpers for captures (photos, scans, 360)
 */

import { COLLECTIONS, CaptureType } from './constants';
import {
  createCapturePayload,
  updateCapturePayload,
} from './builders';
import { mapCaptureDoc } from './mappers';
import { ensureFirestore, resolveServerTimestamp, getIncrementFn } from './utils';

const getCollection = (firestore) => ensureFirestore(firestore).collection(COLLECTIONS.captures);

const adjustProjectMetrics = async (firestore, capture, delta, options = {}) => {
  if (!capture?.projectId) return;

  const db = ensureFirestore(firestore);
  const projectDoc = db.collection(COLLECTIONS.projects).doc(capture.projectId);
  const increment = getIncrementFn(db) || getIncrementFn(firestore);
  const serverTimestamp = resolveServerTimestamp(options);

  if (typeof increment === 'function') {
    const payload = { updatedAt: serverTimestamp() };

    if (capture.type === CaptureType.PHOTO) {
      payload['metrics.totalCaptures'] = increment(delta);
    } else if (capture.type === CaptureType.PHOTO_360) {
      payload['metrics.total360'] = increment(delta);
    } else {
      payload['metrics.totalScans'] = increment(delta);
    }

    await projectDoc.set(payload, { merge: true });
  } else {
    await db.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(projectDoc);
      const data = snapshot.data() || {};
      const metrics = data.metrics || {};

      transaction.set(
        projectDoc,
        {
          metrics: {
            totalCaptures:
              capture.type === CaptureType.PHOTO
                ? (metrics.totalCaptures || 0) + delta
                : metrics.totalCaptures || 0,
            total360:
              capture.type === CaptureType.PHOTO_360
                ? (metrics.total360 || 0) + delta
                : metrics.total360 || 0,
            totalScans:
              capture.type === CaptureType.SCAN_3D
                ? (metrics.totalScans || 0) + delta
                : metrics.totalScans || 0,
          },
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    });
  }
};

export const createCapture = async (firestore, data, options = {}) => {
  const db = ensureFirestore(firestore);
  const collectionRef = getCollection(db);
  const docRef = data?.id ? collectionRef.doc(data.id) : collectionRef.doc();
  const serverTimestamp = resolveServerTimestamp(options);

  const payload = createCapturePayload(data, { serverTimestamp });
  await docRef.set(payload);

  const snapshot = await docRef.get();
  const capture = mapCaptureDoc(snapshot);

  if (options.updateProjectMetrics !== false) {
    await adjustProjectMetrics(db, capture, 1, options);
  }

  return capture;
};

export const updateCapture = async (firestore, captureId, updates, options = {}) => {
  if (!captureId) throw new Error('captureId is required');

  const db = ensureFirestore(firestore);
  const docRef = getCollection(db).doc(captureId);
  const payload = updateCapturePayload(updates, { serverTimestamp: resolveServerTimestamp(options) });

  await docRef.set(payload, { merge: true });
  const snapshot = await docRef.get();
  return mapCaptureDoc(snapshot);
};

export const deleteCapture = async (firestore, captureId, options = {}) => {
  if (!captureId) throw new Error('captureId is required');

  const db = ensureFirestore(firestore);
  const docRef = getCollection(db).doc(captureId);
  const snapshot = await docRef.get();
  const capture = snapshot.exists ? mapCaptureDoc(snapshot) : null;

  await docRef.delete();

  if (capture && options.updateProjectMetrics !== false) {
    await adjustProjectMetrics(db, capture, -1, options);
  }

  return true;
};

export const listCapturesByProject = async (firestore, projectId, { type, limit = 100 } = {}) => {
  if (!projectId) throw new Error('projectId is required');

  const db = ensureFirestore(firestore);
  let query = getCollection(db)
    .where('projectId', '==', projectId)
    .orderBy('createdAt', 'desc');

  if (type) {
    query = query.where('type', '==', type);
  }

  if (limit) {
    query = query.limit(limit);
  }

  const snapshot = await query.get();
  return snapshot.docs.map(mapCaptureDoc);
};

export const listenCapturesByProject = (
  firestore,
  projectId,
  callback,
  { type, limit = 100, onError } = {},
) => {
  if (!projectId) throw new Error('projectId is required');
  if (typeof callback !== 'function') throw new Error('callback is required');

  const db = ensureFirestore(firestore);
  let query = getCollection(db)
    .where('projectId', '==', projectId)
    .orderBy('createdAt', 'desc');

  if (type) {
    query = query.where('type', '==', type);
  }

  if (limit) {
    query = query.limit(limit);
  }

  return query.onSnapshot(
    (snapshot) => {
      const captures = snapshot.docs.map(mapCaptureDoc);
      callback(captures);
    },
    (error) => {
      if (typeof onError === 'function') {
        onError(error);
      } else {
        console.error('Error listening to captures snapshot', error);
      }
    }
  );
};

export const listCapturesByUser = async (firestore, userId, { limit = 100 } = {}) => {
  if (!userId) throw new Error('userId is required');

  const db = ensureFirestore(firestore);
  let query = getCollection(db)
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc');

  if (limit) {
    query = query.limit(limit);
  }

  const snapshot = await query.get();
  return snapshot.docs.map(mapCaptureDoc);
};

export default {
  createCapture,
  updateCapture,
  deleteCapture,
  listCapturesByProject,
  listenCapturesByProject,
  listCapturesByUser,
};
