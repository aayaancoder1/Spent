import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// @ts-ignore
import { initializeAuth, browserLocalPersistence, getReactNativePersistence } from 'firebase/auth';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export const firebaseConfig = {
  apiKey: "PLACEHOLDER_API_KEY",
  authDomain: "spent-oled-finance-tracker.firebaseapp.com",
  projectId: "spent-oled-finance-tracker",
  storageBucket: "spent-oled-finance-tracker.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:1234567890"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const secureStoreAsyncStorage = {
  getItem: async (key: string) => {
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (e) {
      console.warn('SecureStore setItem failed:', e);
    }
  },
  removeItem: async (key: string) => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (e) {
      console.warn('SecureStore removeItem failed:', e);
    }
  }
};

export const auth = initializeAuth(app, {
  persistence: Platform.OS === 'web' 
    ? browserLocalPersistence 
    : getReactNativePersistence(secureStoreAsyncStorage)
});

export const db = getFirestore(app);
