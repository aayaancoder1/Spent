import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Pressable, KeyboardTypeOptions } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { ThemedText } from './themed-text';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/theme/theme';

interface InputFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  rightElement?: React.ReactNode;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

export function InputField({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  rightElement,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
}: InputFieldProps) {
  const colors = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const shouldSecure = secureTextEntry && !showPassword;

  return (
    <View style={styles.inputGroup}>
      <View style={styles.headerRow}>
        <ThemedText
          style={[
            styles.inputLabel,
            { color: isFocused ? colors.primary : colors.textSecondary },
          ]}
        >
          {label}
        </ThemedText>
        {rightElement}
      </View>
      <View
        style={[
          styles.inputWrapper,
          { borderColor: colors.border, backgroundColor: colors.backgroundElement },
          isFocused && { borderColor: colors.primary },
        ]}
      >
        <TextInput
          style={[styles.input, { color: colors.text, paddingRight: secureTextEntry ? 40 : 0 }]}
          placeholder={placeholder}
          placeholderTextColor={`${colors.textSecondary}80`}
          secureTextEntry={shouldSecure}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {secureTextEntry && (
          <Pressable
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <SymbolView
              name={(showPassword ? 'eye.slash' : 'eye') as any}
              size={18}
              tintColor={colors.textSecondary}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    gap: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 14,
    paddingHorizontal: 4,
  },
  inputWrapper: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    height: 52,
    justifyContent: 'center',
    position: 'relative',
  },
  input: {
    fontSize: 16,
    padding: 0,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
});
