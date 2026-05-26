import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from './themed-text';
import { useTheme } from '@/hooks/use-theme';

interface AmountDisplayProps {
  amount: string;
  label?: string;
}

export function AmountDisplay({ amount, label = 'Amount' }: AmountDisplayProps) {
  const colors = useTheme();

  return (
    <View style={styles.amountSection}>
      <ThemedText style={styles.amountLabel}>{label}</ThemedText>
      <View style={styles.amountDisplayRow}>
        <ThemedText style={[styles.currency, { color: colors.primary }]}>$</ThemedText>
        <ThemedText style={styles.amountValue}>{amount}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  amountSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  amountLabel: {
    fontSize: 14,
    color: '#c2c6d7',
    marginBottom: 8,
  },
  amountDisplayRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  currency: {
    fontSize: 48,
    fontWeight: '700',
  },
  amountValue: {
    fontSize: 48,
    fontWeight: '700',
  },
});
