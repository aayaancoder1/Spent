import React from 'react';
import { Pressable, StyleSheet, Platform } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { useTheme } from '@/hooks/use-theme';

interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: string;
}

export function FloatingActionButton({ onPress, icon = 'plus' }: FloatingActionButtonProps) {
  const colors = useTheme();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.fab,
        { backgroundColor: colors.primary },
        pressed && styles.fabPressed,
      ]}
      onPress={onPress}
    >
      <SymbolView name={icon as any} size={24} tintColor="#FFFFFF" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 110 : 95,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2E7DFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 5,
  },
  fabPressed: {
    transform: [{ scale: 0.9 }],
  },
});
