/**
 * Cross-platform Firestore helpers for project operations
 */

import { COLLECTIONS } from './constants';
import {
  createProjectPayload,
  updateProjectPayload,
} from './builders';
import { mapProjectDoc } from './mappers';
import { ensureFirestore, resolveServerTimestamp, getIncrementFn } from './utils';

const getCollection = (firestore) => ensureFirestore(firestore).collection(COLLECTIONS.projects);

export const createProject = async (firestore, data, options = {}) => {
  const db = ensureFirestore(firestore);

  const collectionRef = getCollection(db);
  const docRef = data?.id ? collectionRef.doc(data.id) : collectionRef.doc();

  const serverTimestamp = resolveServerTimestamp(options);
  const payload = createProjectPayload(
    {
      ...data,
      createdBy: data?.createdBy || options?.userId || data?.userId || null,
    },
    { serverTimestamp }
  );

  await docRef.set(payload);

  const snapshot = await docRef.get();
  return mapProjectDoc(snapshot);
};

export const updateProject = async (firestore, projectId, updates, options = {}) => {
  if (!projectId) throw new Error('projectId is required');

  const db = ensureFirestore(firestore);
  const docRef = getCollection(db).doc(projectId);
  const payload = updateProjectPayload(updates, {
    serverTimestamp: resolveServerTimestamp(options),
  });

  await docRef.set(payload, { merge: true });

  const snapshot = await docRef.get();
  return mapProjectDoc(snapshot);
};

export const deleteProject = async (firestore, projectId, options = {}) => {
  if (!projectId) throw new Error('projectId is required');

  const { hardDelete = false } = options;
  const serverTimestamp = resolveServerTimestamp(options);
  const db = ensureFirestore(firestore);
  const docRef = getCollection(db).doc(projectId);

  if (hardDelete) {
    await docRef.delete();
    return true;
  }

  await docRef.set(
    {
      status: 'archived',
      archivedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  return true;
};

export const getProjectById = async (firestore, projectId) => {
  if (!projectId) throw new Error('projectId is required');

  const db = ensureFirestore(firestore);
  const snapshot = await getCollection(db).doc(projectId).get();
  if (!snapshot.exists) {
    return null;
  }
  return mapProjectDoc(snapshot);
};

export const listProjectsByUser = async (firestore, userId, { limit = 50 } = {}) => {
  if (!userId) throw new Error('userId is required');

  const db = ensureFirestore(firestore);
  let query = getCollection(db)
    .where('createdBy', '==', userId)
    .orderBy('createdAt', 'desc');

  if (limit) {
    query = query.limit(limit);
  }

  const snapshot = await query.get();
  return snapshot.docs.map(mapProjectDoc);
};

export const listenProjectsByUser = (firestore, userId, callback, { limit = 50, onError } = {}) => {
  if (!userId) throw new Error('userId is required');
  if (typeof callback !== 'function') throw new Error('callback is required');

  const db = ensureFirestore(firestore);
  let query = getCollection(db)
    .where('createdBy', '==', userId)
    .orderBy('createdAt', 'desc');

  if (limit) {
    query = query.limit(limit);
  }

  return query.onSnapshot(
    (snapshot) => {
      const projects = snapshot.docs.map(mapProjectDoc);
      callback(projects);
    },
    (error) => {
      if (typeof onError === 'function') {
        onError(error);
      } else {
        console.error('Error listening to projects snapshot', error);
      }
    }
  );
};

export const incrementProjectMetrics = async (
  firestore,
  projectId,
  { captures = 0, scans = 0, photos360 = 0 } = {},
  options = {},
) => {
  if (!projectId) throw new Error('projectId is required');

  const db = ensureFirestore(firestore);
  const serverTimestamp = resolveServerTimestamp(options);
  const docRef = getCollection(db).doc(projectId);
  const increment = getIncrementFn(db) || getIncrementFn(firestore);

  if (typeof increment === 'function') {
    const payload = { updatedAt: serverTimestamp() };
    if (captures) payload['metrics.totalCaptures'] = increment(captures);
    if (scans) payload['metrics.totalScans'] = increment(scans);
    if (photos360) payload['metrics.total360'] = increment(photos360);

    await docRef.set(payload, { merge: true });
  } else {
    await db.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(docRef);
      const data = snapshot.data() || {};
      transaction.set(
        docRef,
        {
          metrics: {
            totalCaptures: (data.metrics?.totalCaptures || 0) + captures,
            totalScans: (data.metrics?.totalScans || 0) + scans,
            total360: (data.metrics?.total360 || 0) + photos360,
          },
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    });
  }
};

export default {
  createProject,
  updateProject,
  deleteProject,
  getProjectById,
  listProjectsByUser,
  listenProjectsByUser,
  incrementProjectMetrics,
};
