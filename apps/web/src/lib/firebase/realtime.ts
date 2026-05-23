import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  QueryConstraint,
  DocumentData,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './client';
import { isFirebaseConfigured } from './client';

/**
 * Subscribe to real-time updates on a single Firestore document.
 *
 * Usage:
 *   const unsubscribe = onDocumentChange('users', userId, (data) => {
 *     console.log('User profile updated:', data);
 *   });
 *
 *   // Later, to stop listening:
 *   unsubscribe();
 */
export function onDocumentChange(
  collectionName: string,
  docId: string,
  callback: (data: DocumentData | null) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  if (!isFirebaseConfigured || !db) {
    console.warn('[Archon] Firebase not configured. Real-time updates disabled.');
    callback(null);
    return () => {};
  }

  const docRef = doc(db, collectionName, docId);
  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        callback({ id: snapshot.id, ...snapshot.data() });
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error(`[Archon] Real-time listener error on ${collectionName}/${docId}:`, error);
      onError?.(error);
    }
  );
}

/**
 * Subscribe to real-time updates on a Firestore collection query.
 *
 * Usage:
 *   const unsubscribe = onCollectionChange('repositories', (docs) => {
 *     console.log('Repositories updated:', docs);
 *   }, [
 *     where('ownerId', '==', userId),
 *     orderBy('createdAt', 'desc'),
 *     limit(20),
 *   ]);
 *
 *   // Later, to stop listening:
 *   unsubscribe();
 */
export function onCollectionChange(
  collectionName: string,
  callback: (data: DocumentData[]) => void,
  constraints: QueryConstraint[] = [],
  onError?: (error: Error) => void
): Unsubscribe {
  if (!isFirebaseConfigured || !db) {
    console.warn('[Archon] Firebase not configured. Real-time updates disabled.');
    callback([]);
    return () => {};
  }

  const collectionRef = collection(db, collectionName);
  const q = constraints.length > 0 ? query(collectionRef, ...constraints) : query(collectionRef);

  return onSnapshot(
    q,
    (snapshot) => {
      const docs = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      callback(docs);
    },
    (error) => {
      console.error(`[Archon] Real-time listener error on ${collectionName}:`, error);
      onError?.(error);
    }
  );
}

// Re-export Firestore query helpers for convenience
export { where, orderBy, limit } from 'firebase/firestore';
