import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { ThemedText } from './themed-text';
import { CategoryChip } from './category-chip';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/theme/theme';
import { Transaction } from '@/types/transaction';

interface TransactionCardProps {
  transaction: Transaction;
  showMinusSign?: boolean;
  customTimeText?: string;
  onPress?: () => void;
  footer?: React.ReactNode;
  actionButtons?: React.ReactNode;
}

const formatDate = (date: Date | string) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  
  const compareDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  
  const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
  const timeStr = d.toLocaleTimeString('en-US', timeOptions);

  if (compareDay.getTime() === today.getTime()) {
    return `Today, ${timeStr}`;
  } else if (compareDay.getTime() === yesterday.getTime()) {
    return `Yesterday, ${timeStr}`;
  } else {
    const dateOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return `${d.toLocaleDateString('en-US', dateOptions)}, ${timeStr}`;
  }
};

export function TransactionCard({
  transaction,
  showMinusSign = false,
  customTimeText,
  onPress,
  footer,
  actionButtons,
}: TransactionCardProps) {
  const colors = useTheme();
  
  const formattedAmount = `${showMinusSign ? '-' : ''}$${transaction.amount.toFixed(2)}`;
  const timeDisplay = customTimeText || formatDate(transaction.timestamp);

  const CardWrapper = onPress ? Pressable : View;
  const wrapperProps = onPress 
    ? {
        onPress,
        style: ({ pressed }: { pressed: boolean }) => [
          styles.card,
          { borderColor: colors.border, backgroundColor: colors.backgroundElement },
          pressed && styles.cardPressed
        ]
      }
    : {
        style: [styles.card, { borderColor: colors.border, backgroundColor: colors.backgroundElement }]
      };

  return (
    <CardWrapper {...wrapperProps as any}>
      <View style={styles.txRow}>
        <View style={styles.txLeft}>
          <ThemedText style={styles.txTitle}>{transaction.description}</ThemedText>
          <ThemedText style={styles.txDescription}>{timeDisplay}</ThemedText>
          {!footer && !actionButtons && (
            <View style={styles.tagContainer}>
              <CategoryChip label={transaction.tag} selectable={false} />
            </View>
          )}
        </View>
        <View style={styles.txRight}>
          <ThemedText style={styles.txAmount}>{formattedAmount}</ThemedText>
        </View>
      </View>
      {(footer || actionButtons) && (
        <View style={styles.cardFooter}>
          {footer || <View />}
          {actionButtons}
        </View>
      )}
    </CardWrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: Spacing.three,
    gap: 12,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  txRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  txLeft: {
    flex: 1,
    gap: 4,
  },
  txTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  txDescription: {
    fontSize: 12,
    color: '#c2c6d7',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  txRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  txAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
});
