import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BodyAvatar } from '@/components/BodyAvatar';
import { theme } from '@/constants/theme';
import {
  formatMeasureDate,
  formatMeasureSummary,
  measureToShape,
} from '@/lib/bodyAvatar';
import type { BodyMeasurement } from '@/lib/types';

type ViewMode = 'first' | 'latest' | 'compare';

interface BodyDashboardProps {
  first: BodyMeasurement | null;
  latest: BodyMeasurement | null;
}

export function BodyDashboard({ first, latest }: BodyDashboardProps) {
  const [mode, setMode] = useState<ViewMode>('compare');
  const hasData = Boolean(first || latest);
  const baseline = first ?? latest;

  const renderFigure = (
    label: string,
    measurement: BodyMeasurement | null,
    color: string,
    live: boolean
  ) => {
    const shape = measureToShape(measurement, baseline);
    return (
      <View style={styles.figure}>
        <Text style={styles.figureLabel}>{label}</Text>
        <BodyAvatar shape={shape} color={color} live={live} />
        <Text style={styles.figureDate}>{formatMeasureDate(measurement?.date)}</Text>
        <Text style={styles.figureStats}>{formatMeasureSummary(measurement)}</Text>
      </View>
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>VÜCUT SİMÜLASYONU</Text>
          <Text style={styles.sub}>Ölçülere göre canlı karakter</Text>
        </View>
        <Pressable style={styles.detailBtn} onPress={() => router.push('/(tabs)/tracking')}>
          <Text style={styles.detailText}>Detaylar</Text>
        </Pressable>
      </View>

      <View style={styles.tabs}>
        {(
          [
            ['first', 'İlk Halim'],
            ['latest', 'Son Halim'],
            ['compare', 'Karşılaştır'],
          ] as const
        ).map(([key, label]) => (
          <Pressable
            key={key}
            style={[styles.tab, mode === key && styles.tabActive]}
            onPress={() => setMode(key)}>
            <Text style={[styles.tabText, mode === key && styles.tabTextActive]}>{label}</Text>
          </Pressable>
        ))}
      </View>

      {!hasData ? (
        <View style={styles.empty}>
          <BodyAvatar shape={measureToShape(null)} color={theme.cardBorder} />
          <Text style={styles.emptyText}>
            Takip sekmesinden ölçü girin. İlk ve son haliniz burada görünecek.
          </Text>
          <Pressable style={styles.cta} onPress={() => router.push('/(tabs)/tracking')}>
            <Text style={styles.ctaText}>Ölçü Gir</Text>
          </Pressable>
        </View>
      ) : mode === 'compare' ? (
        <View style={styles.compareRow}>
          {renderFigure('İlk Halim', first ?? latest, '#6B7280', false)}
          <Ionicons name="arrow-forward" size={22} color={theme.purple} style={styles.arrow} />
          {renderFigure('Son Halim', latest ?? first, theme.purple, true)}
        </View>
      ) : mode === 'first' ? (
        renderFigure('İlk Halim', first ?? latest, '#6B7280', false)
      ) : (
        renderFigure('Son Halim', latest ?? first, theme.success, true)
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(16, 20, 38, 0.72)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(138, 43, 255, 0.25)',
    shadowColor: theme.glow.purple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    color: theme.textMuted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
  },
  sub: { color: theme.text, fontSize: 14, fontWeight: '700', marginTop: 4 },
  detailBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(138,43,255,0.4)',
    backgroundColor: 'rgba(138,43,255,0.15)',
  },
  detailText: { color: theme.purple, fontSize: 11, fontWeight: '800' },
  tabs: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.cardBorder,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: 'rgba(138, 43, 255, 0.25)',
    borderColor: theme.purple,
  },
  tabText: { color: theme.textMuted, fontSize: 11, fontWeight: '700' },
  tabTextActive: { color: theme.purple },
  compareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
  },
  figure: { alignItems: 'center', flex: 1, minWidth: 0 },
  figureLabel: {
    color: theme.text,
    fontWeight: '800',
    fontSize: 13,
    marginBottom: 6,
  },
  figureDate: { color: theme.textMuted, fontSize: 11, marginTop: 4 },
  figureStats: {
    color: theme.textMuted,
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 4,
  },
  arrow: { marginHorizontal: 4 },
  empty: { alignItems: 'center', paddingVertical: 8 },
  emptyText: {
    color: theme.textMuted,
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 10,
    paddingHorizontal: 12,
  },
  cta: {
    marginTop: 12,
    backgroundColor: theme.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  ctaText: { color: '#fff', fontWeight: '800' },
});
