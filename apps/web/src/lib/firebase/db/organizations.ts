import { collection, doc, getDoc, getDocs, setDoc, query, where } from 'firebase/firestore';
import { db } from '../client';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export const getOrganization = async (id: string): Promise<Organization | null> => {
  const docRef = doc(db, 'organizations', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Organization;
  }
  return null;
};

export const getOrganizationBySlug = async (slug: string): Promise<Organization | null> => {
  const q = query(collection(db, 'organizations'), where('slug', '==', slug));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const docSnap = querySnapshot.docs[0];
    return { id: docSnap.id, ...docSnap.data() } as Organization;
  }
  return null;
};
