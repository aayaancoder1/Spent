import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { ThemedText } from './themed-text';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/theme/theme';

interface EmptyStateProps {
  title: string;
  description: string;
  illustrationUrl: string;
}

export function EmptyState({ title, description, illustrationUrl }: EmptyStateProps) {
  const colors = useTheme();

  return (
    <View style={styles.emptyState}>
      <View style={[styles.emptyIllustrationBg, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
        <Image
          style={styles.emptyIllustration}
          source={{ uri: illustrationUrl }}
        />
      </View>
      <ThemedText style={styles.emptyTitle}>{title}</ThemedText>
      <ThemedText style={styles.emptyDescription}>{description}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.six,
  },
  emptyIllustrationBg: {
    width: 140,
    height: 140,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.four,
    overflow: 'hidden',
  },
  emptyIllustration: {
    width: 90,
    height: 90,
    opacity: 0.6,
    resizeMode: 'contain',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#c2c6d7',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});
