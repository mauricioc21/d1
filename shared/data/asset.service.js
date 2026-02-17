/**
 * Firestore helpers for project assets (plans, models, tours)
 */

import { COLLECTIONS } from './constants';
import {
  createAssetPayload,
  updateAssetPayload,
} from './builders';
import { mapAssetDoc } from './mappers';
import { ensureFirestore, resolveServerTimestamp } from './utils';

const getCollection = (firestore) => ensureFirestore(firestore).collection(COLLECTIONS.plans);

export const createAsset = async (firestore, data, options = {}) => {
  const db = ensureFirestore(firestore);
  const collectionRef = getCollection(db);
  const docRef = data?.id ? collectionRef.doc(data.id) : collectionRef.doc();
  const payload = createAssetPayload(data, { serverTimestamp: resolveServerTimestamp(options) });

  await docRef.set(payload);
  const snapshot = await docRef.get();
  return mapAssetDoc(snapshot);
};

export const updateAsset = async (firestore, assetId, updates, options = {}) => {
  if (!assetId) throw new Error('assetId is required');

  const db = ensureFirestore(firestore);
  const docRef = getCollection(db).doc(assetId);
  const payload = updateAssetPayload(updates, { serverTimestamp: resolveServerTimestamp(options) });

  await docRef.set(payload, { merge: true });
  const snapshot = await docRef.get();
  return mapAssetDoc(snapshot);
};

export const deleteAsset = async (firestore, assetId) => {
  if (!assetId) throw new Error('assetId is required');

  const db = ensureFirestore(firestore);
  await getCollection(db).doc(assetId).delete();
  return true;
};

export const listAssetsByProject = async (firestore, projectId, { type, limit = 100 } = {}) => {
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
  return snapshot.docs.map(mapAssetDoc);
};

export const listenAssetsByProject = (
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
      const assets = snapshot.docs.map(mapAssetDoc);
      callback(assets);
    },
    (error) => {
      if (typeof onError === 'function') {
        onError(error);
      } else {
        console.error('Error listening to assets snapshot', error);
      }
    }
  );
};

export default {
  createAsset,
  updateAsset,
  deleteAsset,
  listAssetsByProject,
  listenAssetsByProject,
};
