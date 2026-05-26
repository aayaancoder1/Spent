import React, { useEffect } from 'react';
import { View, ActivityIndicator, useColorScheme } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider, useRouter, useSegments } from 'expo-router';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { OnboardingOverlay } from '@/components/onboarding-overlay';

export default function TabLayout() {
  return (
    <AuthProvider>
      <AppLayoutContent />
    </AuthProvider>
  );
}

function AppLayoutContent() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const { user, loading, onboardingCompleted, completeOnboarding } = useAuth();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === 'signin';

    if (!user && !inAuthGroup) {
      // Redirect to signin if not logged in
      router.replace('/signin' as any);
    } else if (user && inAuthGroup) {
      // Redirect to home if logged in and on signin page
      router.replace('/' as any);
    }
  }, [user, loading, segments, router]);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000000', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2E7DFF" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      {user && !onboardingCompleted ? (
        <OnboardingOverlay onComplete={completeOnboarding} />
      ) : (
        <AppTabs />
      )}
    </ThemeProvider>
  );
}
