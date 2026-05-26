import React from 'react';
import { StyleSheet, Pressable, ScrollView, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TransactionCard } from '@/components/transaction-card';
import { FloatingActionButton } from '@/components/fab';
import { SectionHeader } from '@/components/section-header';
import { useTransactions } from '@/hooks/useTransactions';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/theme/theme';

export default function HomeScreen() {
  const router = useRouter();
  const colors = useTheme();
  const { activeTransactions, deleteTransaction } = useTransactions();

  // Dynamic calculations based on the mock transaction store
  const totalSpent = activeTransactions.reduce((acc, tx) => acc + tx.amount, 0);
  const monthlyBudget = 2000.00;
  const balance = Math.max(0, monthlyBudget - totalSpent);
  const usedPercentage = Math.min(100, Math.round((totalSpent / monthlyBudget) * 100));

  const handleCardPress = (tx: any) => {
    alert(`Transaction: ${tx.description}\nCategory: ${tx.tag}\nAmount: $${tx.amount.toFixed(2)}\nTime: ${new Date(tx.timestamp).toLocaleString()}\n\nTip: You can delete this by confirming in the next prompt.`);
    if (confirm(`Move "${tx.description}" to the Bin?`)) {
      deleteTransaction(tx.id);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Top Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <View style={styles.headerLeft}>
            <View style={[styles.avatarContainer, { borderColor: colors.border }]}>
              <Image
                alt="User profile"
                style={styles.avatar}
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEy9Vipz0ikZsl0FuKvoKjdOG2Q4kiC2pNiEBpzzbO_RQ8IwhwzRcL7MzJiW3yGmGr1sJV6f6kQWFND5qpOEH0genoGN6iw9ip5b4Gw7ZXIFlTUMNAKl8WVon4Zi-OfIkkNCczEwTOmkAa3eU5uidNM52U362nwCuHiDGSEQMuzx0BDsnMusjSudnRwpwS6rcklG2m1-4wqYx5HtDI7E6qlYwNSyHHgnJsCFgNjq8XF77TrDBSF1_DzG21V_AWEYlxI1erlOpW_J8' }}
              />
            </View>
            <ThemedText style={styles.logoText}>Spent</ThemedText>
          </View>
          <View style={styles.headerRight}>
            <Pressable 
              style={({ pressed }) => [styles.headerButton, pressed && styles.headerButtonPressed]}
              onPress={() => alert('Filter settings simulated')}
            >
              <SymbolView name="slider.horizontal.3" size={20} tintColor={colors.primary} />
            </Pressable>
            <Pressable 
              style={({ pressed }) => [styles.headerButton, pressed && styles.headerButtonPressed]}
              onPress={() => alert('Notifications screen simulated')}
            >
              <SymbolView name="bell" size={20} tintColor={colors.primary} />
            </Pressable>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* September Balance */}
          <View style={styles.balanceContainer}>
            <ThemedText style={styles.balanceLabel}>Spent Balance</ThemedText>
            <View style={styles.balanceValueRow}>
              <ThemedText style={styles.balanceValue}>${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</ThemedText>
              <View style={styles.trendBadge}>
                <SymbolView name="arrow.down.right" size={12} tintColor={colors.secondary} />
                <ThemedText style={[styles.trendText, { color: colors.secondary }]}>{usedPercentage}%</ThemedText>
              </View>
            </View>

            {/* Budget Tracker */}
            <View style={styles.budgetTracker}>
              <View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
                <View style={[styles.progressBarFill, { backgroundColor: colors.primary, width: `${usedPercentage}%` }]} />
              </View>
              <View style={styles.budgetLabelRow}>
                <ThemedText style={styles.budgetUsage}>Used {usedPercentage}% of monthly budget</ThemedText>
                <ThemedText style={styles.budgetLimit}>${monthlyBudget.toFixed(2)}</ThemedText>
              </View>
            </View>
          </View>

          {/* Transactions Header */}
          <SectionHeader 
            title="Recent Transactions" 
            actionLabel="View All" 
            onActionPress={() => alert('Transaction search and filter view.')}
          />

          {/* Transactions List */}
          <View style={styles.transactionsList}>
            {activeTransactions.length === 0 ? (
              <ThemedText style={styles.emptyText}>No recent transactions. Add one below!</ThemedText>
            ) : (
              activeTransactions.map((tx) => (
                <TransactionCard
                  key={tx.id}
                  transaction={tx}
                  showMinusSign
                  onPress={() => handleCardPress(tx)}
                />
              ))
            )}
          </View>
        </ScrollView>

        {/* Floating Action Button (FAB) */}
        <FloatingActionButton 
          onPress={() => router.push('/add' as any)} 
        />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    borderBottomWidth: 1,
    width: '100%',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 'auto',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonPressed: {
    opacity: 0.7,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: 110,
  },
  balanceContainer: {
    marginBottom: Spacing.five,
  },
  balanceLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#c2c6d7',
    marginBottom: 4,
  },
  balanceValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  balanceValue: {
    fontSize: 36,
    fontWeight: '700',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '500',
  },
  budgetTracker: {
    marginTop: Spacing.three,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    width: '100%',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  budgetLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  budgetUsage: {
    fontSize: 12,
    color: '#c2c6d7',
  },
  budgetLimit: {
    fontSize: 12,
    color: '#c2c6d7',
  },
  transactionsList: {
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#c2c6d7',
    textAlign: 'center',
    marginTop: 20,
  },
});
