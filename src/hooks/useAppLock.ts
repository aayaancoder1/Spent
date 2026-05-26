import { useState, useEffect } from 'react';
import { getSecret, saveSecret, deleteSecret } from '@/services/secureStore';
import { authenticateWithBiometrics, isBiometricsAvailable } from '@/services/biometrics';

export function useAppLock() {
  const [isLocked, setIsLocked] = useState(false);
  const [appLockEnabled, setAppLockEnabled] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const lockEnabled = await getSecret('appLockEnabled');
        const bioEnabled = await getSecret('biometricsEnabled');
        
        setAppLockEnabled(lockEnabled === 'true');
        setBiometricsEnabled(bioEnabled === 'true');
        
        if (lockEnabled === 'true') {
          setIsLocked(true);
        }
      } catch (e) {
        console.error('Failed to load secure lock settings:', e);
      }
    }
    loadSettings();
  }, []);

  const enableAppLock = async (pin: string): Promise<void> => {
    await saveSecret('appPinCode', pin);
    await saveSecret('appLockEnabled', 'true');
    setAppLockEnabled(true);
  };

  const disableAppLock = async (): Promise<void> => {
    await deleteSecret('appPinCode');
    await saveSecret('appLockEnabled', 'false');
    setAppLockEnabled(false);
    setIsLocked(false);
  };

  const enableBiometrics = async (): Promise<boolean> => {
    const available = await isBiometricsAvailable();
    if (available) {
      await saveSecret('biometricsEnabled', 'true');
      setBiometricsEnabled(true);
      return true;
    }
    return false;
  };

  const disableBiometrics = async (): Promise<void> => {
    await saveSecret('biometricsEnabled', 'false');
    setBiometricsEnabled(false);
  };

  const unlockAppWithPIN = async (pin: string): Promise<boolean> => {
    const savedPin = await getSecret('appPinCode');
    if (savedPin === pin) {
      setIsLocked(false);
      return true;
    }
    return false;
  };

  const unlockAppWithBiometrics = async (): Promise<boolean> => {
    if (biometricsEnabled) {
      const success = await authenticateWithBiometrics();
      if (success) {
        setIsLocked(false);
        return true;
      }
    }
    return false;
  };

  return {
    isLocked,
    appLockEnabled,
    biometricsEnabled,
    enableAppLock,
    disableAppLock,
    enableBiometrics,
    disableBiometrics,
    unlockAppWithPIN,
    unlockAppWithBiometrics,
  };
}
