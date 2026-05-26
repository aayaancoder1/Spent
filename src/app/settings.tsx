import React, { useState } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SettingsItem } from '@/components/settings-item';
import { useAuth } from '@/hooks/useAuth';
import { useAppLock } from '@/hooks/useAppLock';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/theme/theme';

export default function SettingsScreen() {
  const router = useRouter();
  const colors = useTheme();
  const { signOut } = useAuth();
  const { 
    appLockEnabled, 
    biometricsEnabled, 
    enableAppLock, 
    disableAppLock, 
    enableBiometrics, 
    disableBiometrics 
  } = useAppLock();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [digestEnabled, setDigestEnabled] = useState(false);

  const toggleAppLock = async (value: boolean) => {
    if (value) {
      await enableAppLock('1234');
      alert('App Lock PIN configured: 1234');
    } else {
      await disableAppLock();
    }
  };

  const toggleBiometrics = async (value: boolean) => {
    if (value) {
      const success = await enableBiometrics();
      if (!success) {
        alert('Biometrics could not be enabled. Ensure you have Face ID/Touch ID registered.');
      }
    } else {
      await disableBiometrics();
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace('/signin' as any);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Top Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <ThemedText style={styles.logoText}>Settings</ThemedText>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Security Section */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Security & Access</ThemedText>
            <View style={[styles.sectionCard, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
              <SettingsItem
                icon="lock"
                title="App Lock"
                description="Require authentication on startup"
                type="switch"
                value={appLockEnabled}
                onValueChange={toggleAppLock}
              />
              <SettingsItem
                icon="key"
                title="Set PIN Code"
                description="Configure a 4-digit security PIN"
                type="link"
                onPress={() => alert('PIN setup screen simulated')}
              />
              <SettingsItem
                icon="faceid"
                title="Biometrics"
                description="Use Touch ID or Face ID"
                type="switch"
                value={biometricsEnabled}
                onValueChange={toggleBiometrics}
                isLast
              />
            </View>
          </View>

          {/* Notifications Section */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Notifications</ThemedText>
            <View style={[styles.sectionCard, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
              <SettingsItem
                icon="bell"
                title="Transaction Alerts"
                description="Instant notifications for entries"
                type="switch"
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
              />
              <SettingsItem
                icon="doc.plaintext"
                title="Weekly Digest"
                description="Summary reports on spending"
                type="switch"
                value={digestEnabled}
                onValueChange={setDigestEnabled}
                isLast
              />
            </View>
          </View>

          {/* Account Section */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Account</ThemedText>
            <View style={[styles.sectionCard, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
              <SettingsItem
                icon="person.crop.circle"
                title="Account Settings"
                description="Manage email and profile data"
                type="link"
                onPress={() => router.push('/signin' as any)}
              />
              <SettingsItem
                icon="rectangle.portrait.and.arrow.right"
                title="Sign Out"
                description="Sign out of your account"
                type="button"
                onPress={handleSignOut}
                isDestructive
                isLast
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    height: 64,
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    borderBottomWidth: 1,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: 110,
    gap: Spacing.four,
  },
  section: {
    gap: Spacing.two,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8c90a0',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 4,
  },
  sectionCard: {
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
});
