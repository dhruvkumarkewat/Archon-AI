'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signOut as firebaseSignOut, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
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
      if (err.code === 'auth/api-key-not-valid' || err.code === 'auth/invalid-api-key') {
        console.warn("Invalid Firebase API Key. Falling back to Demo mode.");
        setIsDemo(true);
        return demoSignInWithEmail(email, pass);
      }
      throw err;
    }
  };

  const register = async (email: string, pass: string, name: string, orgName: string, orgSlug: string) => {
    if (isDemo) {
      return demoRegisterWithEmail(email, pass, name, orgName, orgSlug);
    }
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(cred.user, { displayName: name });
      return cred;
    } catch (err: any) {
      if (err.code === 'auth/api-key-not-valid' || err.code === 'auth/invalid-api-key') {
        console.warn("Invalid Firebase API Key. Falling back to Demo mode.");
        setIsDemo(true);
        return demoRegisterWithEmail(email, pass, name, orgName, orgSlug);
      }
      throw err;
    }
  };

  const oauthLogin = async (provider: 'google' | 'github') => {
    if (isDemo) {
      return demoSignInWithProvider(provider);
    }
    try {
      const authProvider = provider === 'google' ? new GoogleAuthProvider() : new GithubAuthProvider();
      return await signInWithPopup(auth, authProvider);
    } catch (err: any) {
      if (err.code === 'auth/api-key-not-valid' || err.code === 'auth/invalid-api-key' || err.code === 'auth/operation-not-supported-in-this-environment') {
        console.warn("Firebase OAuth failed. Falling back to Demo mode.");
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
