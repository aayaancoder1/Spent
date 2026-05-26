import React from 'react';
import { StyleSheet, Pressable, ScrollView, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TransactionCard } from '@/components/transaction-card';
import { EmptyState } from '@/components/empty-state';
import { useTransactions } from '@/hooks/useTransactions';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/theme/theme';
import { getDaysLeft } from '@/utils/date';

export default function BinScreen() {
  const colors = useTheme();
  const { 
    deletedTransactions: items, 
    restoreTransaction, 
    permanentlyDeleteTransaction, 
    emptyBin 
  } = useTransactions();

  const handleRestore = (id: string) => {
    restoreTransaction(id);
  };

  const handleDelete = (id: string) => {
    permanentlyDeleteTransaction(id);
  };

  const handleEmptyBin = () => {
    emptyBin();
  };

  const emptyBinButton = items.length > 0 && (
    <Pressable
      style={({ pressed }) => [
        styles.emptyBinBtn,
        { borderColor: `${colors.error}40` },
        pressed && { backgroundColor: `${colors.error}20` },
      ]}
      onPress={handleEmptyBin}
    >
      <SymbolView name="trash.slash" size={16} tintColor={colors.error} />
      <ThemedText style={[styles.emptyBinBtnText, { color: colors.error }]}>Empty Bin</ThemedText>
    </Pressable>
  );

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Top Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <View style={styles.headerLeft}>
            <View style={[styles.avatarContainer, { borderColor: colors.border, backgroundColor: colors.border }]}>
              <Image
                alt="User avatar"
                style={styles.avatar}
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArMPa55UUIlhdO-38sKtFgZ3ggWvS5bXvq-AlN1orVMV0ISIiU0eP0w-VSiCQ-Iow2G4rODwj1z_YoSZiO0ZwBXL8qvyx0zWaF3c0tEvydGeeAQT9vxD6NT2-E_mVrIh8xuEowSQW_0smP0wRhwxUyLwRQO1U0WIlua70XCfP3GUdLDzGbFw8b79SRqpNNUR3wmwDiCNr4RAQ69d-geFajT3O5iipSoVNb7KSHn7OwbmZ0hXaaftVvX0f6tRaIuDKdh3WjDhsUnuc' }}
              />
            </View>
            <ThemedText style={styles.logoText}>Spent</ThemedText>
          </View>
          {emptyBinButton}
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Section Info Header */}
          <View style={styles.infoSection}>
            <ThemedText style={styles.title}>Bin</ThemedText>
            <ThemedText style={styles.subtitle}>
              Transactions stay here for 30 days before permanent deletion.
            </ThemedText>
          </View>

          {items.length === 0 ? (
            /* Empty State */
            <EmptyState
              title="Your bin is empty"
              description="Deleted items will appear here for a limited time."
              illustrationUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuDmjbcVQr1cTQ14ELtKJPesZRDL97-da32TB6tIyoQ_kn1_eLtUkOVgZIPfIXIy32q4r4MLtcTk7ABY2bHbwIFk5HAm7LvG07BjqBY5DPvJ7uZrcYl7oo-vPeTK2QSwoiJZxz4KImmiURm0FkYcL1xvqg2bn9MGkxKQgLR7zn_nV0G0xH8qrwjm_aZYTPNjidhnc706TC5mvylTaqz9sETzttWR8qgNJ7MBp8B7o3YnEAsmcgZqvIMYO99wB2f0E8Fv_5LbUalENa4"
            />
          ) : (
            /* Items List */
            <View style={styles.list}>
              {items.map((item) => {
                const clampedDaysLeft = getDaysLeft(item.timestamp);

                const cardFooter = (
                  <View style={styles.daysRow}>
                    <SymbolView name="clock" size={12} tintColor={colors.error} />
                    <ThemedText style={[styles.daysText, { color: colors.error }]}>
                      {clampedDaysLeft} days left
                    </ThemedText>
                  </View>
                );

                const actionButtons = (
                  <View style={styles.actions}>
                    <Pressable
                      style={({ pressed }) => [
                        styles.actionBtn,
                        { backgroundColor: `${colors.primary}15` },
                        pressed && { backgroundColor: `${colors.primary}30` },
                      ]}
                      onPress={() => handleRestore(item.id)}
                    >
                      <ThemedText style={[styles.actionBtnText, { color: colors.primary }]}>Restore</ThemedText>
                    </Pressable>
                    <Pressable
                      style={({ pressed }) => [
                        styles.actionBtn,
                        { backgroundColor: `${colors.error}15` },
                        pressed && { backgroundColor: `${colors.error}30` },
                      ]}
                      onPress={() => handleDelete(item.id)}
                    >
                      <ThemedText style={[styles.actionBtnText, { color: colors.error }]}>Delete</ThemedText>
                    </Pressable>
                  </View>
                );

                return (
                  <TransactionCard
                    key={item.id}
                    transaction={item}
                    customTimeText="Deleted recently"
                    footer={cardFooter}
                    actionButtons={actionButtons}
                  />
                );
              })}
            </View>
          )}
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
  emptyBinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  emptyBinBtnText: {
    fontSize: 12,
    fontWeight: '500',
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: 110,
  },
  infoSection: {
    marginBottom: Spacing.five,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#A0A0A0',
    lineHeight: 20,
  },
  list: {
    gap: 12,
  },
  daysRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  daysText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
