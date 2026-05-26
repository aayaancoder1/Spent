import React, { useState } from 'react';
import { StyleSheet, Pressable, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { InputField } from '@/components/input-field';
import { PrimaryButton, SecondaryButton } from '@/components/button';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/theme/theme';

export default function SignInScreen() {
  const router = useRouter();
  const colors = useTheme();
  const { signIn, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    await signIn(email, password);
    router.replace('/' as any);
  };

  const forgotPasswordLink = (
    <Pressable onPress={() => alert('Forgot password screen simulated')}>
      <ThemedText style={[styles.forgotBtn, { color: colors.primary }]}>Forgot?</ThemedText>
    </Pressable>
  );

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.logoText}>Spent</ThemedText>
        </View>

        <View style={styles.content}>
          {/* Welcome Text */}
          <View style={styles.welcomeContainer}>
            <ThemedText style={styles.title}>Welcome back</ThemedText>
            <ThemedText style={styles.subtitle}>Enter your details to manage your wealth.</ThemedText>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Email Field */}
            <InputField
              label="Email Address"
              placeholder="name@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            {/* Password Field */}
            <InputField
              label="Password"
              placeholder="••••••••"
              secureTextEntry
              rightElement={forgotPasswordLink}
              value={password}
              onChangeText={setPassword}
            />

            {/* Buttons */}
            <PrimaryButton
              label="Sign In"
              onPress={handleSignIn}
              loading={loading}
            />

            <SecondaryButton
              label="Create new account"
              onPress={() => alert('Registration screen simulated')}
            />
          </View>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            <ThemedText style={styles.dividerText}>OR CONTINUE WITH</ThemedText>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </View>

          {/* Google Auth Button */}
          <Pressable
            style={({ pressed }) => [
              styles.googleBtn,
              { borderColor: colors.border, backgroundColor: colors.backgroundElement },
              pressed && styles.btnPressed
            ]}
            onPress={() => alert('Google authentication simulated')}
          >
            <Image
              style={styles.googleIcon}
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2_C59hgWZTfwEKqI5bdkcUF2Ta8GW0oD522J74R4QQ8gAUTR3DeFBIsCFAlmmwCEqMKfKCBqd2OTV34VU_N6Q8rUg5qElNj11c6JrkbG6xmVWrYBnUzBuyP0XQ0j4m3rD5U7hAtdBgRvxVfAAs8tSxZhJhUlsRkJx5rYS2uk7h7klG47hDLI8u18VBBAm33VGZFvTRYoDImO3023OfEaKeU59tqKODRw4Cs5JR--luxfdR6kbiUqJskoR7lrNYrJlqgvvQaUsF1s' }}
            />
            <ThemedText style={styles.googleBtnText}>Google</ThemedText>
          </Pressable>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>
            By continuing, you agree to Spent&apos;s <ThemedText style={styles.underline}>Terms of Service</ThemedText> and <ThemedText style={styles.underline}>Privacy Policy</ThemedText>.
          </ThemedText>
        </View>
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
    justifyContent: 'space-between',
  },
  header: {
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    gap: Spacing.five,
  },
  welcomeContainer: {
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    color: '#A0A0A0',
    textAlign: 'center',
  },
  form: {
    gap: Spacing.three,
  },
  forgotBtn: {
    fontSize: 14,
    fontWeight: '500',
  },
  btnPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 11,
    color: '#8c90a0',
    fontWeight: '500',
  },
  googleBtn: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  googleIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  googleBtnText: {
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.four,
  },
  footerText: {
    fontSize: 11,
    color: '#c2c6d7',
    textAlign: 'center',
    lineHeight: 16,
  },
  underline: {
    textDecorationLine: 'underline',
  },
});
