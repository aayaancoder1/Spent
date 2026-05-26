import { useState } from 'react';
import { User } from '@/types/user';

export function useAuth() {
  const [user, setUser] = useState<User | null>({
    uid: 'dummy-uid-123',
    email: 'user@example.com',
    displayName: 'OLED User',
  });
  const [loading, setLoading] = useState(false);

  const signIn = async (email: string, _password: string): Promise<void> => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      setUser({
        uid: 'dummy-uid-123',
        email,
        displayName: 'OLED User',
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    signIn,
    signOut,
    isAuthenticated: !!user,
  };
}
