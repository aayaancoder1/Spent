import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';
import * as Notifications from 'expo-notifications';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { NumericKeypad } from './numeric-keypad';
import { PrimaryButton, SecondaryButton } from './button';
import { useAppLock } from '@/hooks/useAppLock';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/theme/theme';

interface OnboardingOverlayProps {
  onComplete: () => Promise<void>;
}

export function OnboardingOverlay({ onComplete }: OnboardingOverlayProps) {
  const colors = useTheme();
  const { enableAppLock, enableBiometrics } = useAppLock();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [pin, setPin] = useState('');

  const handleKeyPress = (val: string) => {
    if (val === '.') return; // PIN can't have decimals
    if (pin.length < 4) {
      const nextPin = pin + val;
      setPin(nextPin);
      if (nextPin.length === 4) {
        // Auto save PIN and advance
        setTimeout(async () => {
          await enableAppLock(nextPin);
          setStep(3);
        }, 300);
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handleEnableBiometrics = async () => {
    await enableBiometrics();
    setStep(4);
  };

  const handleRequestNotifications = async () => {
    try {
      await Notifications.requestPermissionsAsync();
    } catch (e) {
      console.warn('Notifications permission request failed:', e);
    }
    setStep(5);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.content}>
            <SymbolView name="sparkles" size={64} tintColor={colors.primary} />
            <ThemedText style={styles.title}>Welcome to Spent</ThemedText>
            <ThemedText style={styles.description}>
              An OLED-first minimalist finance tracker. Let&apos;s configure your local wallet security.
            </ThemedText>
            <View style={styles.spacer} />
            <PrimaryButton label="Get Started" onPress={() => setStep(2)} />
          </View>
        );
      case 2:
        return (
          <View style={styles.content}>
            <SymbolView name="lock" size={64} tintColor={colors.primary} />
            <ThemedText style={styles.title}>Create secure PIN</ThemedText>
            <ThemedText style={styles.description}>
              Enter a 4-digit PIN to lock your financial records.
            </ThemedText>
            
            {/* PIN Indicator Dots */}
            <View style={styles.pinIndicatorRow}>
              {[0, 1, 2, 3].map((index) => {
                const isEntered = pin.length > index;
                return (
                  <View
                    key={index}
                    style={[
                      styles.pinDot,
                      { borderColor: colors.border },
                      isEntered && { backgroundColor: colors.primary, borderColor: colors.primary }
                    ]}
                  />
                );
              })}
            </View>

            <View style={styles.spacer} />
            
            <NumericKeypad
              onKeyPress={handleKeyPress}
              onBackspace={handleBackspace}
            />
          </View>
        );
      case 3:
        return (
          <View style={styles.content}>
            <SymbolView name="faceid" size={64} tintColor={colors.primary} />
            <ThemedText style={styles.title}>Enable Biometrics</ThemedText>
            <ThemedText style={styles.description}>
              Use Touch ID or Face ID for fast, hardware-secured authentication.
            </ThemedText>
            <View style={styles.spacer} />
            <View style={styles.btnCol}>
              <PrimaryButton label="Enable Biometrics" onPress={handleEnableBiometrics} />
              <SecondaryButton label="Skip for Now" onPress={() => setStep(4)} />
            </View>
          </View>
        );
      case 4:
        return (
          <View style={styles.content}>
            <SymbolView name="bell" size={64} tintColor={colors.primary} />
            <ThemedText style={styles.title}>Alert Permissions</ThemedText>
            <ThemedText style={styles.description}>
              Enable push alerts to parse transactions and receive instant weekly spending updates.
            </ThemedText>
            <View style={styles.spacer} />
            <View style={styles.btnCol}>
              <PrimaryButton label="Enable Notifications" onPress={handleRequestNotifications} />
              <SecondaryButton label="Skip" onPress={() => setStep(5)} />
            </View>
          </View>
        );
      case 5:
        return (
          <View style={styles.content}>
            <SymbolView name="checkmark.circle" size={64} tintColor={colors.secondary} />
            <ThemedText style={styles.title}>Setup Complete</ThemedText>
            <ThemedText style={styles.description}>
              Your local profile has been secured. You are ready to start tracking your wealth.
            </ThemedText>
            <View style={styles.spacer} />
            <PrimaryButton label="Enter Dashboard" onPress={onComplete} />
          </View>
        );
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Step Progress Dots */}
        <View style={styles.progressRow}>
          {[1, 2, 3, 4, 5].map((i) => {
            const isCurrent = step === i;
            return (
              <View
                key={i}
                style={[
                  styles.progressDot,
                  { backgroundColor: colors.border },
                  isCurrent && { backgroundColor: colors.primary }
                ]}
              />
            );
          })}
        </View>

        {renderStepContent()}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    justifyContent: 'space-between',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 12,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.five,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 24,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#A0A0A0',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 22,
    paddingHorizontal: 24,
  },
  pinIndicatorRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 32,
    justifyContent: 'center',
  },
  pinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  spacer: {
    flex: 1,
  },
  btnCol: {
    width: '100%',
    gap: 12,
    paddingBottom: 24,
  },
});
