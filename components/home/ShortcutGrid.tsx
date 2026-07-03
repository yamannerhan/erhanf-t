import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

const SHORTCUTS = [
  {
    id: 'workout',
    title: 'Antrenman',
    subtitle: 'Program',
    icon: 'barbell' as const,
    color: '#A855F7',
    route: '/(tabs)/workout',
  },
  {
    id: 'diet',
    title: 'Diyet',
    subtitle: 'Beslenme',
    icon: 'restaurant' as const,
    color: '#22C55E',
    route: '/(tabs)/diet',
  },
  {
    id: 'stats',
    title: 'İstatistik',
    subtitle: 'Gelişim',
    icon: 'stats-chart' as const,
    color: '#3B82F6',
    route: '/stats',
  },
  {
    id: 'water',
    title: 'Su Takibi',
    subtitle: 'Hedef',
    icon: 'water' as const,
    color: '#22D3EE',
    route: '/water',
  },
  {
    id: 'tracking',
    title: 'Ölçümler',
    subtitle: 'Analiz',
    icon: 'heart' as const,
    color: '#F472B6',
    route: '/(tabs)/tracking',
  },
  {
    id: 'achievements',
    title: 'Başarılar',
    subtitle: 'Rozetler',
    icon: 'trophy' as const,
    color: '#FBBF24',
    route: '/achievements',
  },
];

export function ShortcutGrid() {
  return (
    <View style={styles.wrap}>
      {SHORTCUTS.map((s) => (
        <Pressable
          key={s.id}
          style={({ pressed }) => [styles.cell, pressed && styles.pressed]}
          onPress={() => router.push(s.route as never)}>
          <View style={[styles.card, { borderColor: `${s.color}33` }]}>
            <View
              style={[
                styles.iconGlow,
                {
                  shadowColor: s.color,
                  backgroundColor: `${s.color}18`,
                },
              ]}>
              <Ionicons name={s.icon} size={14} color={s.color} />
            </View>
            <View style={styles.textBlock}>
              <Text style={styles.title} numberOfLines={1}>
                {s.title}
              </Text>
              <Text style={styles.subtitle} numberOfLines={1}>
                {s.subtitle}
              </Text>
            </View>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    padding: 4,
    backgroundColor: 'rgba(8,10,18,0.6)',
    overflow: 'hidden',
    minHeight: 0,
  },
  cell: {
    flex: 1,
    minWidth: 0,
    alignSelf: 'stretch',
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.97 }],
  },
  card: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: 'rgba(12,14,24,0.92)',
    paddingVertical: 5,
    paddingHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 0,
  },
  iconGlow: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textBlock: {
    width: '100%',
    alignItems: 'center',
    flexShrink: 0,
    marginTop: 3,
  },
  title: {
    color: theme.text,
    fontSize: 7,
    fontWeight: '800',
    textAlign: 'center',
    width: '100%',
    lineHeight: 9,
  },
  subtitle: {
    color: 'rgba(148,163,184,0.95)',
    fontSize: 6,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 1,
    width: '100%',
    lineHeight: 8,
  },
});
