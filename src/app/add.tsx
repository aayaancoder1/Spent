import React, { useState } from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AmountDisplay } from '@/components/amount-display';
import { InputField } from '@/components/input-field';
import { CategoryChip } from '@/components/category-chip';
import { NumericKeypad } from '@/components/numeric-keypad';
import { useTransactions } from '@/hooks/useTransactions';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/theme/theme';

export default function ManualEntryScreen() {
  const router = useRouter();
  const colors = useTheme();
  const { addTransaction } = useTransactions();

  const [amount, setAmount] = useState('0.00');
  const [isFirstEntry, setIsFirstEntry] = useState(true);
  const [description, setDescription] = useState('');
  const [selectedTag, setSelectedTag] = useState<'Necessity' | 'Personal' | 'Pleasure'>('Necessity');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success'>('idle');

  const appendNum = (val: string) => {
    if (saveStatus === 'success') return;

    if (isFirstEntry) {
      setAmount(val === '.' ? '0.' : val);
      setIsFirstEntry(false);
    } else {
      if (val === '.' && amount.includes('.')) return;

      // Limit to 2 decimal places
      if (amount.includes('.')) {
        const parts = amount.split('.');
        if (parts[1] && parts[1].length >= 2) return;
      }

      setAmount((prev) => prev + val);
    }
  };

  const backspace = () => {
    if (saveStatus === 'success') return;

    if (amount.length <= 1) {
      setAmount('0.00');
      setIsFirstEntry(true);
    } else {
      const nextAmount = amount.slice(0, -1);
      if (nextAmount === '' || nextAmount === '-') {
        setAmount('0.00');
        setIsFirstEntry(true);
      } else {
        setAmount(nextAmount);
      }
    }
  };

  const handleSave = () => {
    if (saveStatus === 'success') return;
    
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    addTransaction(parsedAmount, description, selectedTag);
    setSaveStatus('success');

    setTimeout(() => {
      setSaveStatus('idle');
      setAmount('0.00');
      setIsFirstEntry(true);
      setDescription('');
      router.push('/' as any);
    }, 1500);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Top Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <View style={styles.headerLeft}>
            <View style={[styles.avatarContainer, { borderColor: colors.border, backgroundColor: colors.border }]}>
              <SymbolView name="person" size={16} tintColor={colors.textSecondary as any} />
            </View>
            <ThemedText style={styles.logoText}>Spent</ThemedText>
          </View>
          <Pressable
            style={({ pressed }) => [styles.closeButton, pressed && styles.closeButtonPressed]}
            onPress={() => router.push('/' as any)}
          >
            <SymbolView name="xmark" size={18} tintColor={colors.primary} />
          </Pressable>
        </View>

        {/* Content Area */}
        <View style={styles.content}>
          {/* Amount Display */}
          <AmountDisplay amount={amount} />

          {/* Form Fields */}
          <View style={styles.formSection}>
            {/* Description */}
            <InputField
              label="Description"
              placeholder="What was this for?"
              value={description}
              onChangeText={setDescription}
            />

            {/* Category selection */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Category</ThemedText>
              <View style={styles.tagChips}>
                {(['Necessity', 'Personal', 'Pleasure'] as const).map((tag) => {
                  const isActive = selectedTag === tag;
                  return (
                    <CategoryChip
                      key={tag}
                      label={tag}
                      isActive={isActive}
                      onPress={() => setSelectedTag(tag)}
                    />
                  );
                })}
              </View>
            </View>
          </View>

          <View style={styles.spacer} />

          {/* Custom Numeric Keypad */}
          <NumericKeypad
            onKeyPress={appendNum}
            onBackspace={backspace}
          />
        </View>

        {/* Save Button */}
        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <Pressable
            style={[
              styles.saveBtn,
              saveStatus === 'success'
                ? { backgroundColor: colors.secondary }
                : { backgroundColor: colors.primary },
            ]}
            onPress={handleSave}
          >
            {saveStatus === 'success' ? (
              <>
                <ThemedText style={styles.saveBtnText}>Success</ThemedText>
                <SymbolView name="checkmark.circle.fill" size={20} tintColor="#FFFFFF" />
              </>
            ) : (
              <>
                <ThemedText style={styles.saveBtnText}>Save Transaction</ThemedText>
                <SymbolView name="checkmark.circle" size={20} tintColor="#FFFFFF" />
              </>
            )}
          </Pressable>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonPressed: {
    opacity: 0.7,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  content: {
    flex: 1,
  },
  formSection: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    color: '#c2c6d7',
    paddingHorizontal: 4,
  },
  tagChips: {
    flexDirection: 'row',
    gap: 8,
  },
  spacer: {
    flex: 1,
  },
  footer: {
    borderTopWidth: 1,
    padding: Spacing.four,
    paddingBottom: 24,
  },
  saveBtn: {
    height: 56,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
