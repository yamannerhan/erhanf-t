import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { GlassCard } from '@/components/GlassCard';
import { ProgressRing } from '@/components/ProgressRing';
import {
  getCompletedExerciseCount,
  getCompletedSessionCount,
  getTotalExerciseTargetCount,
  getTotalWaterLiters,
} from '@/lib/database';
import { theme } from '@/constants/theme';

export function ProgressCard() {
  const [workouts, setWorkouts] = useState({ done: 24, total: 36 });
  const [calories, setCalories] = useState({ done: 12450, total: 20000 });
  const [water, setWater] = useState({ done: 42.5, total: 67.5 });
  const [successRate, setSuccessRate] = useState(68);
  const anim = useSharedValue(0);

  useEffect(() => {
    (async () => {
      const [sessions, exercises, totalEx, waterL] = await Promise.all([
        getCompletedSessionCount(),
        getCompletedExerciseCount(),
        getTotalExerciseTargetCount(),
        getTotalWaterLiters(),
      ]);
      const wTotal = Math.max(totalEx || 36, 1);
      const wDone = exercises || sessions || 24;
      const rate = Math.round((wDone / wTotal) * 100);
      setWorkouts({ done: wDone, total: wTotal });
      setCalories({ done: 12450, total: 20000 });
      setWater({ done: Math.round(waterL * 10) / 10 || 42.5, total: 67.5 });
      setSuccessRate(Math.min(rate, 100) || 68);
      anim.value = withTiming(1, { duration: 1200 });
    })();
  }, [anim]);

  const ringStyle = useAnimatedStyle(() => ({
    opacity: anim.value,
  }));

  const bars = [
    { label: 'Tamamlanan Antrenman', done: workouts.done, total: workouts.total, color: theme.purple },
    { label: 'Yakılan Kalori', done: calories.done, total: calories.total, color: theme.gold, unit: ' kcal' },
    { label: 'İçilen Su', done: water.done, total: water.total, color: theme.blue, unit: ' L' },
  ];

  const size = 100;

  return (
    <GlassCard glow="purple" style={styles.card} borderColor="rgba(138,43,255,0.35)">
      <View style={styles.header}>
        <Text style={styles.title}>İLERLEMEN</Text>
        <Pressable onPress={() => router.push('/stats' as never)}>
          <Text style={styles.detail}>Detaylar</Text>
        </Pressable>
      </View>

      <View style={styles.body}>
        <View style={styles.bars}>
          {bars.map((b) => {
            const pct = Math.min(b.done / b.total, 1);
            return (
              <View key={b.label} style={styles.barRow}>
                <View style={styles.barHeader}>
                  <Text style={styles.barLabel}>{b.label}</Text>
                  <Text style={styles.barVal}>
                    {b.done.toLocaleString('tr-TR')} / {b.total.toLocaleString('tr-TR')}
                    {b.unit ?? ''}
                  </Text>
                </View>
                <View style={styles.barBg}>
                  <View
                    style={[
                      styles.barFill,
                      { width: `${pct * 100}%`, backgroundColor: b.color },
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </View>

        <Animated.View style={[styles.ringWrap, ringStyle]}>
          <ProgressRing size={size} stroke={8} progress={successRate / 100}>
            <View style={styles.ringCenter}>
              <Text style={styles.ringPct}>{successRate}%</Text>
              <Text style={styles.ringSub}>Başarı{'\n'}Oranı</Text>
            </View>
          </ProgressRing>
        </Animated.View>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 14 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: { color: theme.textMuted, fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
  detail: { color: theme.purple, fontSize: 12, fontWeight: '800' },
  body: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  bars: { flex: 1, gap: 10, minWidth: 0 },
  barRow: { gap: 4 },
  barHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  barLabel: { color: theme.textMuted, fontSize: 9, fontWeight: '600', flex: 1 },
  barVal: { color: theme.text, fontSize: 9, fontWeight: '700' },
  barBg: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: 3 },
  ringWrap: { flexShrink: 0, width: 100 },
  ringCenter: { alignItems: 'center' },
  ringPct: { color: theme.text, fontSize: 20, fontWeight: '900' },
  ringSub: { color: theme.textMuted, fontSize: 8, fontWeight: '700', textAlign: 'center' },
});
