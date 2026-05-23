'use client';

import { useEffect, useState } from 'react';
import { DocumentData, QueryConstraint } from 'firebase/firestore';
import { onDocumentChange, onCollectionChange } from '@/lib/firebase/realtime';

/**
 * React hook for real-time Firestore document subscription.
 *
 * Usage in a component:
 *   const { data, loading, error } = useRealtimeDoc('users', userId);
 *
 *   if (loading) return <p>Loading...</p>;
 *   if (error) return <p>Error: {error.message}</p>;
 *   return <p>Welcome, {data?.fullName}</p>;
 */
export function useRealtimeDoc(collectionName: string, docId: string | null) {
  const [data, setData] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!docId) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = onDocumentChange(
      collectionName,
      docId,
      (doc) => {
        setData(doc);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, docId]);

  return { data, loading, error };
}

/**
 * React hook for real-time Firestore collection subscription.
 *
 * Usage in a component:
 *   import { where, orderBy } from '@/lib/firebase/realtime';
 *
 *   const { data, loading, error } = useRealtimeCollection(
 *     'repositories',
 *     [where('ownerId', '==', userId), orderBy('createdAt', 'desc')]
 *   );
 *
 *   if (loading) return <p>Loading...</p>;
 *   return data.map(repo => <RepoCard key={repo.id} repo={repo} />);
 */
export function useRealtimeCollection(
  collectionName: string,
  constraints: QueryConstraint[] = []
) {
  const [data, setData] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubscribe = onCollectionChange(
      collectionName,
      (docs) => {
        setData(docs);
        setLoading(false);
      },
      constraints,
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName, JSON.stringify(constraints)]);

  return { data, loading, error };
}
