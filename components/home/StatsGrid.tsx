import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import Svg, { Polyline, Rect } from 'react-native-svg';
import { ProgressRing } from '@/components/ProgressRing';
import { DASHBOARD, WAIST_TREND, WEIGHT_TREND } from '@/lib/dashboardDefaults';

const CARD_BG = '#12142b';

function MiniLineChart({ data, color }: { data: number[]; color: string }) {
  const w = 76;
  const h = 32;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 12) - 6;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <Svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet">
      <Polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function MiniBarChart({ color }: { color: string }) {
  const bars = [0.45, 0.75, 0.5, 0.95, 0.6];
  const w = 76;
  const h = 32;
  const barW = 10;
  const gap = 4;

  return (
    <Svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet">
      {bars.map((pct, i) => {
        const barH = pct * (h - 10);
        return (
          <Rect
            key={i}
            x={i * (barW + gap) + 2}
            y={h - barH - 5}
            width={barW}
            height={barH}
            fill={color}
            rx={2}
          />
        );
      })}
    </Svg>
  );
}

const CARDS = [
  {
    key: 'weight',
    icon: '⚖️',
    label: 'Kilo',
    value: DASHBOARD.weight,
    delta: DASHBOARD.weightDelta,
    color: '#C084FC',
    border: 'rgba(138,43,255,0.45)',
    glow: 'rgba(138,43,255,0.14)',
    chart: <MiniLineChart data={WEIGHT_TREND} color="#A855F7" />,
    route: '/(tabs)/tracking' as const,
  },
  {
    key: 'waist',
    icon: '📏',
    label: 'Bel',
    value: DASHBOARD.waist,
    delta: DASHBOARD.waistDelta,
    color: '#22C55E',
    border: 'rgba(34,197,94,0.45)',
    glow: 'rgba(34,197,94,0.12)',
    chart: <MiniLineChart data={WAIST_TREND} color="#22C55E" />,
    route: '/(tabs)/tracking' as const,
  },
  {
    key: 'water',
    icon: '💧',
    label: 'Su Tüketimi',
    value: DASHBOARD.water,
    delta: `%${DASHBOARD.waterPct}`,
    color: '#60A5FA',
    border: 'rgba(47,128,255,0.45)',
    glow: 'rgba(47,128,255,0.12)',
    chart: (
      <ProgressRing size={36} stroke={4} progress={DASHBOARD.waterPct / 100} color="#2F80FF" />
    ),
    route: '/water' as const,
  },
  {
    key: 'cal',
    icon: '🔥',
    label: 'Kalori',
    value: DASHBOARD.caloriesToday,
    delta: 'Bugün',
    color: '#FFC400',
    border: 'rgba(255,196,0,0.45)',
    glow: 'rgba(255,196,0,0.12)',
    chart: <MiniBarChart color="#FFC400" />,
    route: '/stats' as const,
  },
];

export function StatsGrid() {
  return (
    <View style={styles.grid}>
      {CARDS.map((c) => (
        <Pressable
          key={c.key}
          style={({ pressed }) => [styles.cell, pressed && styles.pressed]}
          onPress={() => router.push(c.route as never)}>
          <View
            style={[
              styles.card,
              { borderColor: c.border, shadowColor: c.color },
            ]}>
            <View style={[styles.glow, { backgroundColor: c.glow }]} />
            <View style={styles.top}>
              <Text style={styles.icon}>{c.icon}</Text>
              <Text style={styles.label} numberOfLines={1}>
                {c.label}
              </Text>
              <Text style={[styles.value, { color: c.color }]} numberOfLines={1}>
                {c.value}
              </Text>
              <Text style={styles.delta} numberOfLines={1}>
                {c.delta}
              </Text>
            </View>
            <View style={styles.chart}>{c.chart}</View>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flex: 1,
    flexDirection: 'row',
    gap: 5,
    minHeight: 0,
  },
  cell: { flex: 1, minWidth: 0, alignSelf: 'stretch', height: '100%' },
  pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 15,
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingTop: 7,
    paddingBottom: 8,
    flex: 1,
    minHeight: 0,
    overflow: 'hidden',
    justifyContent: 'space-between',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 5,
    elevation: 4,
  },
  glow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 40,
    opacity: 0.7,
  },
  top: { zIndex: 1, flexShrink: 0 },
  icon: { fontSize: 12, lineHeight: 14 },
  label: {
    color: 'rgba(248,250,252,0.78)',
    fontSize: 8,
    fontWeight: '600',
    marginTop: 2,
  },
  value: {
    fontSize: 11,
    fontWeight: '900',
    marginTop: 3,
    letterSpacing: -0.2,
  },
  delta: {
    color: 'rgba(148,163,184,0.92)',
    fontSize: 7,
    fontWeight: '500',
    marginTop: 2,
  },
  chart: {
    flex: 1,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    zIndex: 1,
    marginTop: 4,
    paddingBottom: 2,
  },
});
