import React from 'react';
import { StyleSheet, View, Pressable, Dimensions } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { ThemedText } from './themed-text';
import { useTheme } from '@/hooks/use-theme';

interface NumericKeypadProps {
  onKeyPress: (val: string) => void;
  onBackspace: () => void;
}

export function NumericKeypad({ onKeyPress, onBackspace }: NumericKeypadProps) {
  const colors = useTheme();

  return (
    <View style={[styles.keypadWrapper, { borderTopColor: colors.border }]}>
      <View style={[styles.grid, { backgroundColor: colors.border }]}>
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'].map((num) => (
          <Pressable
            key={num}
            style={({ pressed }) => [
              styles.key,
              { backgroundColor: colors.background },
              pressed && { backgroundColor: colors.border },
            ]}
            onPress={() => onKeyPress(num)}
          >
            <ThemedText style={styles.keyText}>{num}</ThemedText>
          </Pressable>
        ))}
        <Pressable
          style={({ pressed }) => [
            styles.key,
            { backgroundColor: colors.background },
            pressed && { backgroundColor: colors.border },
          ]}
          onPress={onBackspace}
        >
          <SymbolView name="delete.left" size={22} tintColor={colors.text as any} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  keypadWrapper: {
    borderTopWidth: 1,
    width: '100%',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 1,
  },
  key: {
    width: (Dimensions.get('window').width - 2) / 3,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyText: {
    fontSize: 20,
    fontWeight: '600',
  },
});
