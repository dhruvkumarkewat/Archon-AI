import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../client';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  organizationId: string;
  role: 'VIEWER' | 'DEVELOPER' | 'ADMIN';
  createdAt: string;
}

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as UserProfile;
  }
  return null;
};
