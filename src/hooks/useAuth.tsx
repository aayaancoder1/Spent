import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut 
} from 'firebase/auth';
import * as SecureStore from 'expo-secure-store';
import { auth } from '@/services/firebase';
import { User } from '@/types/user';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  onboardingCompleted: boolean;
  completeOnboarding: () => Promise<void>;
  resetOnboarding: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  useEffect(() => {
    // Listen for auth state transitions
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || 'OLED User',
        });
        
        // Load onboarding completion status for this specific user
        try {
          const status = await SecureStore.getItemAsync(`onboardingCompleted_${firebaseUser.uid}`);
          setOnboardingCompleted(status === 'true');
        } catch {
          setOnboardingCompleted(false);
        }
      } else {
        setUser(null);
        setOnboardingCompleted(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e: any) {
      let msg = 'Authentication failed.';
      if (e.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password.';
      } else if (e.code === 'auth/invalid-email') {
        msg = 'Invalid email address format.';
      } else if (e.code === 'auth/network-request-failed') {
        msg = 'Network error. Please check your internet connection.';
      }
      alert(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (e: any) {
      let msg = 'Registration failed.';
      if (e.code === 'auth/email-already-in-use') {
        msg = 'This email address is already in use.';
      } else if (e.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      } else if (e.code === 'auth/invalid-email') {
        msg = 'Invalid email address format.';
      } else if (e.code === 'auth/network-request-failed') {
        msg = 'Network error. Please check your internet connection.';
      }
      alert(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      setLoading(false);
    }
  };

  const completeOnboarding = async () => {
    if (user) {
      try {
        await SecureStore.setItemAsync(`onboardingCompleted_${user.uid}`, 'true');
        setOnboardingCompleted(true);
      } catch (e) {
        console.error('Failed to save onboarding completed status:', e);
      }
    }
  };

  const resetOnboarding = async () => {
    if (user) {
      try {
        await SecureStore.deleteItemAsync(`onboardingCompleted_${user.uid}`);
        setOnboardingCompleted(false);
      } catch (e) {
        console.error('Failed to reset onboarding status:', e);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        onboardingCompleted,
        completeOnboarding,
        resetOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
