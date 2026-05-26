import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';
import { useTheme } from '@/hooks/use-theme';

interface CategoryChipProps {
  label: string;
  isActive?: boolean;
  selectable?: boolean;
  onPress?: () => void;
}

export function CategoryChip({ label, isActive, selectable = true, onPress }: CategoryChipProps) {
  const colors = useTheme();

  if (!selectable) {
    return (
      <View style={[styles.tagBadge, { backgroundColor: colors.border }]}>
        <ThemedText style={styles.tagText}>{label}</ThemedText>
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.tagChip,
        { borderColor: colors.border, backgroundColor: colors.backgroundElement },
        isActive && {
          backgroundColor: colors.primary,
          borderColor: colors.primary,
        },
      ]}
    >
      <ThemedText
        style={[
          styles.tagChipText,
          { color: colors.textSecondary },
          isActive && { color: '#FFFFFF', fontWeight: '600' },
        ]}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  tagText: {
    fontSize: 10,
    color: '#c2c6d7',
    fontWeight: '500',
  },
  tagChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    borderWidth: 1,
  },
  tagChipText: {
    fontSize: 14,
  },
});
