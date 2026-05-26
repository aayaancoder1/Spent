import React from 'react';
import { View, StyleSheet, Pressable, Switch } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { ThemedText } from './themed-text';
import { useTheme } from '@/hooks/use-theme';

interface SettingsItemProps {
  icon: string;
  title: string;
  description: string;
  type: 'switch' | 'button' | 'link';
  value?: boolean;
  onValueChange?: (val: boolean) => void;
  onPress?: () => void;
  isDestructive?: boolean;
  isLast?: boolean;
}

export function SettingsItem({
  icon,
  title,
  description,
  type,
  value = false,
  onValueChange,
  onPress,
  isDestructive = false,
  isLast = false,
}: SettingsItemProps) {
  const colors = useTheme();

  const renderIcon = () => (
    <SymbolView
      name={icon as any}
      size={18}
      tintColor={isDestructive ? colors.error : colors.primary}
    />
  );

  const renderContent = () => (
    <View style={styles.settingLabelGroup}>
      {renderIcon()}
      <View style={styles.textGroup}>
        <ThemedText style={[styles.settingTitle, isDestructive && { color: colors.error }]}>
          {title}
        </ThemedText>
        <ThemedText style={styles.settingDesc}>{description}</ThemedText>
      </View>
    </View>
  );

  if (type === 'switch') {
    return (
      <View style={[styles.settingRow, isLast && { borderBottomWidth: 0 }]}>
        {renderContent()}
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: colors.border, true: colors.primary }}
        />
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.settingRow,
        isLast && { borderBottomWidth: 0 },
        pressed && styles.rowPressed,
      ]}
    >
      {renderContent()}
      {type === 'link' && (
        <SymbolView name="chevron.right" size={14} tintColor={colors.textSecondary as any} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  settingLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  textGroup: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  settingDesc: {
    fontSize: 12,
    color: '#A0A0A0',
    marginTop: 2,
  },
  rowPressed: {
    opacity: 0.7,
  },
});
