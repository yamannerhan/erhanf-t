import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { GlassCard } from '@/components/GlassCard';
import { ProgressRing } from '@/components/ProgressRing';
import {
  formatTurkishDate,
  getFitnessStartDate,
  getProgramDay,
} from '@/lib/appMeta';
import { theme } from '@/constants/theme';

const TOTAL_DAYS = 90;

export function StartDateCard({ compact = false }: { compact?: boolean }) {
  const [startDate, setStartDate] = useState('');
  const [dayCount, setDayCount] = useState(1);

  useEffect(() => {
    (async () => {
      const date = await getFitnessStartDate();
      setStartDate(date);
      setDayCount(await getProgramDay());
    })();
  }, []);

  const progress = Math.min(dayCount / TOTAL_DAYS, 1);
  const size = compact ? 58 : 88;

  return (
    <Pressable onPress={() => router.push('/start-date' as never)} style={styles.press}>
      <GlassCard
        glow="gold"
        borderColor="rgba(255,196,0,0.3)"
        style={[styles.card, compact && styles.cardCompact]}>
        <Text style={styles.title}>SPORA BAŞLAMA</Text>
        {!compact && (
          <Text style={styles.date}>{startDate ? formatTurkishDate(startDate) : '—'}</Text>
        )}
        {compact && startDate ? (
          <Text style={styles.dateCompact}>{formatTurkishDate(startDate)}</Text>
        ) : null}

        <ProgressRing size={size} stroke={compact ? 6 : 7} progress={progress}>
          <View style={styles.ringCenter}>
            <Text style={[styles.ringNum, compact && styles.ringNumSm]}>{dayCount}</Text>
            <Text style={styles.ringLabel}>GÜN</Text>
          </View>
        </ProgressRing>

        <Text style={styles.sub}>
          {dayCount} / {TOTAL_DAYS} Gün
        </Text>
        {!compact && <Text style={styles.detailText}>Detayları Gör ›</Text>}
      </GlassCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { flexShrink: 0 },
  card: {
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
    width: 118,
  },
  cardCompact: { width: 96, paddingVertical: 8, paddingHorizontal: 6 },
  title: {
    color: theme.textMuted,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  date: {
    color: theme.text,
    fontSize: 9,
    fontWeight: '700',
    marginTop: 4,
    textAlign: 'center',
  },
  dateCompact: {
    color: theme.textMuted,
    fontSize: 7,
    fontWeight: '700',
    marginTop: 2,
    textAlign: 'center',
  },
  ringCenter: { alignItems: 'center' },
  ringNum: { color: theme.text, fontSize: 24, fontWeight: '900', lineHeight: 26 },
  ringNumSm: { fontSize: 20 },
  ringLabel: { color: theme.textMuted, fontSize: 9, fontWeight: '800' },
  sub: { color: theme.textMuted, fontSize: 9, textAlign: 'center', marginTop: 4 },
  detailText: { color: theme.purple, fontSize: 9, fontWeight: '800', marginTop: 6 },
});
