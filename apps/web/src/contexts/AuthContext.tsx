'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signOut as firebaseSignOut, signInWithPopup, signInWithRedirect, getRedirectResult, GoogleAuthProvider, GithubAuthProvider, fetchSignInMethodsForEmail, linkWithCredential } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '@/lib/firebase/client';
import { DemoUser, getCurrentUser, onAuthChange as onDemoAuthChange, signInWithEmail as demoSignInWithEmail, registerWithEmail as demoRegisterWithEmail, signOut as demoSignOut, signInWithProvider as demoSignInWithProvider } from '@/lib/auth';

export type AppUser = User | DemoUser | null;

interface AuthContextType {
  user: AppUser;
  loading: boolean;
  login: (email: string, pass: string) => Promise<any>;
  register: (email: string, pass: string, name: string, orgName: string, orgSlug: string) => Promise<any>;
  logout: () => Promise<void>;
  oauthLogin: (provider: 'google' | 'github') => Promise<any>;
  isDemo: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  oauthLogin: async () => {},
  isDemo: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AppUser>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(!isFirebaseConfigured);

  useEffect(() => {
    if (isDemo) {
      const unsubscribe = onDemoAuthChange((demoUser) => {
        setUser(demoUser);
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      try {
        // Handle redirect result from OAuth redirect fallback
        getRedirectResult(auth).then((result) => {
          if (result?.user) {
            setUser(result.user);
            setLoading(false);
          }
        }).catch((err) => {
          console.warn('Redirect result error:', err);
        });

        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
          setUser(firebaseUser);
          setLoading(false);
        }, (error) => {
          console.error("Firebase Auth Error:", error);
          setIsDemo(true); // Fallback to demo on error
        });
        return () => unsubscribe();
      } catch (err) {
        console.error("Firebase initialization failed, falling back to demo mode", err);
        setIsDemo(true);
      }
    }
  }, [isDemo]);

  const login = async (email: string, pass: string) => {
    if (isDemo) {
      return demoSignInWithEmail(email, pass);
    }
    try {
      return await signInWithEmailAndPassword(auth, email, pass);
    } catch (err: any) {
      const fallbackCodes = ['auth/api-key-not-valid', 'auth/invalid-api-key', 'auth/internal-error', 'auth/network-request-failed'];
      if (fallbackCodes.includes(err.code)) {
        console.warn(`Firebase login failed (${err.code}). Falling back to Demo mode.`);
        setIsDemo(true);
        return demoSignInWithEmail(email, pass);
      }
      // Provide user-friendly error messages
      const messages: Record<string, string> = {
        'auth/user-not-found': 'No account found with this email. Please register first.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/invalid-credential': 'Invalid email or password. Please try again.',
        'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
        'auth/user-disabled': 'This account has been disabled.',
        'auth/invalid-email': 'Please enter a valid email address.',
      };
      throw new Error(messages[err.code] || err.message || 'Failed to sign in');
    }
  };

  const register = async (email: string, pass: string, name: string, orgName: string, orgSlug: string) => {
    if (isDemo) {
      return demoRegisterWithEmail(email, pass, name, orgName, orgSlug);
    }
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(cred.user, { displayName: name });

      // Save user profile and organization to Firestore
      try {
        const { doc, setDoc } = await import('firebase/firestore');
        const { db } = await import('@/lib/firebase/client');

        // Create organization document
        const orgId = cred.user.uid + '-org';
        await setDoc(doc(db, 'organizations', orgId), {
          name: orgName,
          slug: orgSlug,
          createdAt: new Date().toISOString(),
          ownerId: cred.user.uid,
        });

        // Create user profile document
        await setDoc(doc(db, 'users', cred.user.uid), {
          email: email,
          fullName: name,
          organizationId: orgId,
          role: 'ADMIN',
          createdAt: new Date().toISOString(),
        });
      } catch (firestoreErr) {
        console.warn('Firestore write failed (auth still succeeded):', firestoreErr);
      }

      return cred;
    } catch (err: any) {
      const fallbackCodes = ['auth/api-key-not-valid', 'auth/invalid-api-key', 'auth/internal-error', 'auth/network-request-failed'];
      if (fallbackCodes.includes(err.code)) {
        console.warn(`Firebase register failed (${err.code}). Falling back to Demo mode.`);
        setIsDemo(true);
        return demoRegisterWithEmail(email, pass, name, orgName, orgSlug);
      }
      // Provide user-friendly error messages
      const messages: Record<string, string> = {
        'auth/email-already-in-use': 'An account with this email already exists. Please sign in instead.',
        'auth/weak-password': 'Password is too weak. Please use at least 8 characters.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/too-many-requests': 'Too many attempts. Please try again later.',
        'auth/operation-not-allowed': 'Email/password accounts are not enabled. Please contact support.',
      };
      throw new Error(messages[err.code] || err.message || 'Failed to create account');
    }
  };

  const oauthLogin = async (provider: 'google' | 'github') => {
    if (isDemo) {
      return demoSignInWithProvider(provider);
    }
    try {
      const authProvider = provider === 'google' ? new GoogleAuthProvider() : new GithubAuthProvider();
      try {
        return await signInWithPopup(auth, authProvider);
      } catch (popupErr: any) {
        // If popup is blocked, try redirect
        if (popupErr.code === 'auth/popup-blocked' || popupErr.code === 'auth/popup-closed-by-user') {
          console.warn('Popup blocked, trying redirect...');
          await signInWithRedirect(auth, authProvider);
          return; // redirect will reload the page
        }
        throw popupErr;
      }
    } catch (err: any) {
      if (err.code === 'auth/account-exists-with-different-credential') {
        const pendingCred = provider === 'github' ? GithubAuthProvider.credentialFromError(err) : GoogleAuthProvider.credentialFromError(err);
        const email = err.customData?.email;
        if (email && pendingCred) {
          try {
            const methods = await fetchSignInMethodsForEmail(auth, email);
            if (methods.includes('google.com')) {
              alert('Your email is already registered with Google. Please sign in with Google in the upcoming popup to link your GitHub account.');
              const result = await signInWithPopup(auth, new GoogleAuthProvider());
              await linkWithCredential(result.user, pendingCred);
              return result;
            } else if (methods.includes('password')) {
              throw new Error('An account already exists with this email using a password. Please sign in with Email/Password first.');
            }
          } catch (linkErr: any) {
            throw linkErr;
          }
        }
      }

      const fallbackCodes = [
        'auth/api-key-not-valid',
        'auth/invalid-api-key',
        'auth/operation-not-supported-in-this-environment',
        'auth/unauthorized-domain',
        'auth/internal-error',
        'auth/network-request-failed',
        'auth/cancelled-popup-request',
      ];
      if (fallbackCodes.includes(err.code)) {
        console.warn(`Firebase OAuth failed (${err.code}). Falling back to Demo mode.`);
        setIsDemo(true);
        return demoSignInWithProvider(provider);
      }
      throw err;
    }
  };

  const logout = async () => {
    if (isDemo) {
      return demoSignOut();
    }
    return firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, oauthLogin, isDemo }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
