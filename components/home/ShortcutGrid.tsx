import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

const SHORTCUTS = [
  {
    id: 'workout',
    title: 'Antrenman',
    subtitle: 'Program',
    icon: 'barbell-outline' as const,
    color: '#A855F7',
    route: '/(tabs)/workout',
  },
  {
    id: 'diet',
    title: 'Diyet',
    subtitle: 'Beslenme',
    icon: 'restaurant-outline' as const,
    color: '#22C55E',
    route: '/(tabs)/diet',
  },
  {
    id: 'stats',
    title: 'İstatistik',
    subtitle: 'Gelişim',
    icon: 'stats-chart-outline' as const,
    color: '#3B82F6',
    route: '/stats',
  },
  {
    id: 'water',
    title: 'Su Takibi',
    subtitle: 'Hedef',
    icon: 'water-outline' as const,
    color: '#22D3EE',
    route: '/water',
  },
  {
    id: 'tracking',
    title: 'Ölçümler',
    subtitle: 'Analiz',
    icon: 'heart-outline' as const,
    color: '#F472B6',
    route: '/(tabs)/tracking',
  },
  {
    id: 'achievements',
    title: 'Başarılar',
    subtitle: 'Rozetler',
    icon: 'trophy-outline' as const,
    color: '#FBBF24',
    route: '/achievements',
  },
];

export function ShortcutGrid() {
  const { width } = useWindowDimensions();
  const compact = width < 400;

  const content = SHORTCUTS.map((s) => (
    <Pressable
      key={s.id}
      style={({ pressed }) => [styles.cell, compact && styles.cellCompact, pressed && styles.pressed]}
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
          <Ionicons name={s.icon} size={compact ? 13 : 14} color={s.color} />
        </View>
        <View style={styles.textBlock}>
          <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}>
            {s.title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {s.subtitle}
          </Text>
        </View>
      </View>
    </Pressable>
  ));

  if (compact) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollWrap}>
        {content}
      </ScrollView>
    );
  }

  return <View style={styles.wrap}>{content}</View>;
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    padding: 8,
    backgroundColor: 'rgba(8,10,18,0.6)',
    overflow: 'hidden',
  },
  scrollWrap: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    backgroundColor: 'rgba(8,10,18,0.6)',
    overflow: 'hidden',
  },
  scrollContent: {
    flexDirection: 'row',
    gap: 8,
    padding: 8,
    paddingRight: 12,
  },
  cell: {
    flex: 1,
    minWidth: 0,
  },
  cellCompact: {
    flex: 0,
    width: 72,
    minWidth: 72,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.97 }],
  },
  card: {
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: 'rgba(12,14,24,0.92)',
    paddingVertical: 6,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 64,
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
