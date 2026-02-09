/**
 * Shared helpers for Firestore interoperability
 */

export const ensureFirestore = (firestore) => {
  if (!firestore || typeof firestore.collection !== 'function') {
    throw new Error('A valid Firestore instance is required');
  }
  return firestore;
};

export const resolveServerTimestamp = (options = {}) => {
  const { serverTimestamp } = options;
  if (typeof serverTimestamp === 'function') {
    return serverTimestamp;
  }
  if (serverTimestamp) {
    return () => serverTimestamp;
  }
  return () => new Date();
};

export const getIncrementFn = (firestore) => {
  const increment = firestore?.FieldValue?.increment
    || firestore?.app?.firebase_?.firestore?.FieldValue?.increment
    || firestore?.app?._delegate?.constructor?.FieldValue?.increment
    || firestore?.fieldValuesImpl?.increment;

  if (typeof increment === 'function') {
    return increment;
  }

  return null;
};

export default {
  ensureFirestore,
  resolveServerTimestamp,
  getIncrementFn,
};
