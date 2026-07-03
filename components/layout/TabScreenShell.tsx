import { Pressable, StyleSheet, Text, View, type ReactNode } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export function TabScreenShell({
  title,
  subtitle,
  subtitleColor = '#9CA3AF',
  paddingTop,
  paddingBottom,
  children,
}: {
  title: string;
  subtitle?: string;
  subtitleColor?: string;
  paddingTop: number;
  paddingBottom: number;
  children: ReactNode;
}) {
  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop }]}>
        <Pressable style={styles.iconBtn} onPress={() => router.push('/(tabs)/index')}>
          <Ionicons name="chevron-back" size={18} color="#F8FAFC" />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{title}</Text>
          {subtitle ? (
            <Text style={[styles.headerSub, { color: subtitleColor }]} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        <View style={styles.headerRight}>
          <Pressable style={styles.iconBtn} onPress={() => router.push('/start-date' as never)}>
            <Ionicons name="calendar-outline" size={16} color="#F8FAFC" />
          </Pressable>
          <Pressable style={styles.iconBtn} onPress={() => router.push('/settings')}>
            <Ionicons name="options-outline" size={16} color="#F8FAFC" />
          </Pressable>
        </View>
      </View>
      <View style={[styles.body, { paddingBottom }]}>{children}</View>
    </View>
  );
}

export function TabSlot({
  flex,
  children,
  row,
  shrink,
}: {
  flex?: number;
  children: ReactNode;
  row?: boolean;
  shrink?: boolean;
}) {
  return (
    <View
      style={[
        styles.slot,
        flex != null && { flex },
        shrink && styles.shrink,
        row && styles.row,
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#05070A', overflow: 'hidden' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 4,
    gap: 6,
    flexShrink: 0,
  },
  headerCenter: { flex: 1, alignItems: 'center', minWidth: 0 },
  headerTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  headerSub: {
    fontSize: 8,
    fontWeight: '600',
    marginTop: 1,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  headerRight: { flexDirection: 'row', gap: 4 },
  iconBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    paddingHorizontal: 10,
    gap: 3,
    minHeight: 0,
  },
  slot: { minHeight: 0, minWidth: 0, overflow: 'hidden' },
  shrink: { flexShrink: 0 },
  row: { flexDirection: 'row', gap: 4 },
});
