import { Tabs, TabList, TabTrigger, TabSlot, TabTriggerSlotProps } from 'expo-router/ui';
import { Pressable, useColorScheme, View, StyleSheet, Platform } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { Colors, Spacing } from '@/theme/theme';

export default function AppTabs() {
  return (
    <Tabs style={styles.container}>
      <TabSlot style={{ flex: 1 }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="index" href="/" asChild>
            <TabButton icon="house">Home</TabButton>
          </TabTrigger>
          <TabTrigger name="add" href={"/add" as any} asChild>
            <TabButton icon="plus.circle">Add</TabButton>
          </TabTrigger>
          <TabTrigger name="bin" href={"/bin" as any} asChild>
            <TabButton icon="trash">Bin</TabButton>
          </TabTrigger>
          <TabTrigger name="settings" href={"/settings" as any} asChild>
            <TabButton icon="gear">Settings</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

function TabButton({ children, isFocused, icon, ...props }: TabTriggerSlotProps & { icon: string }) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  return (
    <Pressable {...props} style={({ pressed }) => [styles.tabButton, pressed && styles.pressed]}>
      <ThemedView
        style={[
          styles.tabButtonView,
          isFocused && { backgroundColor: colors.backgroundSelected + '20' }
        ]}>
        <SymbolView
          name={icon as any}
          size={20}
          tintColor={isFocused ? colors.primary : colors.textSecondary}
          style={styles.icon}
        />
        <ThemedText
          type="small"
          style={[
            styles.label,
            { color: isFocused ? colors.primary : colors.textSecondary }
          ]}>
          {children}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

function CustomTabList({ children, ...props }: { children: React.ReactNode }) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  return (
    <View {...props} style={[styles.tabListContainer, { backgroundColor: colors.background + '95', borderColor: colors.border }]}>
      <View style={styles.innerContainer}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabListContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: Platform.OS === 'ios' ? 90 : 75,
    borderTopWidth: 1,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Platform.OS === 'ios' ? 24 : Spacing.two,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonView: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: 16,
    gap: 4,
    backgroundColor: 'transparent',
  },
  icon: {
    width: 20,
    height: 20,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
  },
  pressed: {
    opacity: 0.7,
  },
});
