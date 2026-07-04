import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ProgressRing } from '@/components/ProgressRing';
import { DASHBOARD } from '@/lib/dashboardDefaults';
import { theme } from '@/constants/theme';

function formatNum(n: number) {
  return n.toLocaleString('tr-TR');
}

function GradientBar({
  pct,
  colors,
}: {
  pct: number;
  colors: readonly [string, string];
}) {
  return (
    <View style={styles.barBg}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.barFill, { width: `${Math.min(pct, 1) * 100}%` }]}
      />
    </View>
  );
}

export function CompactProgressCard() {
  const bars = [
    {
      label: 'Tamamlanan Antrenman',
      done: DASHBOARD.workoutsDone,
      total: DASHBOARD.workoutsTotal,
      colors: ['#A855F7', '#7C3AED'] as const,
      suffix: '',
    },
    {
      label: 'Yakılan Kalori',
      done: DASHBOARD.caloriesBurned,
      total: DASHBOARD.caloriesGoal,
      colors: ['#FBBF24', '#F59E0B'] as const,
      suffix: ' kcal',
    },
    {
      label: 'İçilen Su',
      done: DASHBOARD.waterTotal,
      total: DASHBOARD.waterGoal,
      colors: ['#60A5FA', '#3B82F6'] as const,
      suffix: ' L',
    },
  ];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          İLERLEMEN
        </Text>
        <Pressable
          style={styles.detailBtn}
          onPress={() => router.push('/stats' as never)}
          hitSlop={6}>
          <Text style={styles.detailText}>Detaylar</Text>
          <Ionicons name="chevron-forward" size={8} color="#B8BBC7" />
        </Pressable>
      </View>

      <View style={styles.main}>
        <View style={styles.ringWrap}>
          <ProgressRing
            size={50}
            stroke={4}
            progress={DASHBOARD.successRate / 100}
            color="#A855F7">
            <View style={styles.ringCenter}>
              <Text style={styles.ringPct}>{DASHBOARD.successRate}%</Text>
              <Text style={styles.ringSub}>Başarı{'\n'}Oranı</Text>
            </View>
          </ProgressRing>
        </View>

        <View style={styles.bars}>
          {bars.map((b) => {
            const pct = b.done / b.total;
            return (
              <View key={b.label} style={styles.barRow}>
                <View style={styles.barHeader}>
                  <Text style={styles.barLabel} numberOfLines={1}>
                    {b.label}
                  </Text>
                  <Text style={styles.barValue} numberOfLines={1}>
                    {formatNum(b.done)}/{formatNum(b.total)}
                    {b.suffix}
                  </Text>
                </View>
                <GradientBar pct={pct} colors={b.colors} />
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignSelf: 'stretch',
    flexDirection: 'column',
    backgroundColor: '#070B12',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingTop: 7,
    paddingBottom: 7,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    minWidth: 0,
    minHeight: 0,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
    flexShrink: 0,
  },
  title: {
    color: '#B8BBC7',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    flex: 1,
  },
  detailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    flexShrink: 0,
  },
  detailText: {
    color: '#B8BBC7',
    fontSize: 7,
    fontWeight: '600',
  },
  main: {
    flex: 1,
    flexDirection: 'column',
    minHeight: 0,
    justifyContent: 'space-between',
  },
  ringWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    flexShrink: 0,
  },
  ringCenter: { alignItems: 'center' },
  ringPct: {
    color: theme.text,
    fontSize: 11,
    fontWeight: '900',
    lineHeight: 13,
  },
  ringSub: {
    color: 'rgba(148,163,184,0.9)',
    fontSize: 5,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 6,
  },
  bars: {
    flexShrink: 0,
    gap: 4,
    paddingTop: 2,
  },
  barRow: {
    gap: 2,
  },
  barHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 4,
  },
  barLabel: {
    color: 'rgba(148,163,184,0.92)',
    fontSize: 6,
    fontWeight: '600',
    flex: 1,
    minWidth: 0,
  },
  barValue: {
    color: 'rgba(248,250,252,0.88)',
    fontSize: 6,
    fontWeight: '700',
    flexShrink: 0,
  },
  barBg: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: 2 },
});
