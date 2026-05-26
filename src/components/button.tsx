import React from 'react';
import { Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { ThemedText } from './themed-text';
import { useTheme } from '@/hooks/use-theme';

interface ButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function PrimaryButton({ label, onPress, loading, disabled }: ButtonProps) {
  const colors = useTheme();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.primaryBtn,
        { backgroundColor: colors.primary },
        (pressed || disabled || loading) && styles.btnPressed,
        disabled && { opacity: 0.5 },
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#FFFFFF" />
      ) : (
        <ThemedText style={styles.primaryBtnText}>{label}</ThemedText>
      )}
    </Pressable>
  );
}

export function SecondaryButton({ label, onPress, disabled }: ButtonProps) {
  const colors = useTheme();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.secondaryBtn,
        { borderColor: colors.border },
        (pressed || disabled) && { backgroundColor: colors.backgroundElement, opacity: 0.8 },
        disabled && { opacity: 0.5 },
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <ThemedText style={styles.secondaryBtnText}>{label}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  primaryBtn: {
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryBtn: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '500',
  },
  btnPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
