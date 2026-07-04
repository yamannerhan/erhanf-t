import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/components/AppProvider';
import { BodySimulationCard } from '@/components/home/BodySimulationCard';
import { CompactProgressCard } from '@/components/home/CompactProgressCard';
import { DashboardHeroCard } from '@/components/home/DashboardHeroCard';
import { HomeAnnouncementBar } from '@/components/home/HomeAnnouncementBar';
import { HomeHeader } from '@/components/home/HomeHeader';
import { MotivationCard } from '@/components/home/MotivationCard';
import { ShortcutGrid } from '@/components/home/ShortcutGrid';
import { StatsGrid } from '@/components/home/StatsGrid';
import { CONTENT_BOTTOM_PAD, HOME_GAP, PAIR_MIN_HEIGHT, useHomeLayout } from '@/lib/homeLayout';
import { DASHBOARD } from '@/lib/dashboardDefaults';
import {
  getFirstMeasurement,
  getLatestMeasurement,
  getWorkoutDays,
} from '@/lib/database';
import type { BodyMeasurement, WorkoutDay } from '@/lib/types';

export default function HomeScreen() {
  const { ready, refreshKey } = useApp();
  const insets = useSafeAreaInsets();
  const layout = useHomeLayout();
  const [days, setDays] = useState<WorkoutDay[]>([]);
  const [latest, setLatest] = useState<BodyMeasurement | null>(null);
  const [first, setFirst] = useState<BodyMeasurement | null>(null);

  const load = useCallback(async () => {
    const [d, m, f] = await Promise.all([
      getWorkoutDays(),
      getLatestMeasurement(),
      getFirstMeasurement(),
    ]);
    setDays(d);
    setLatest(m);
    setFirst(f);
  }, []);

  useEffect(() => {
    if (ready) load();
  }, [ready, refreshKey, load]);

  const todayDay =
    days.find((d) => d.dayNumber === DASHBOARD.programDay) ??
    days[(DASHBOARD.programDay - 1) % Math.max(days.length, 1)] ??
    null;

  if (!ready) return null;

  return (
    <View
      style={[
        styles.root,
        {
          paddingTop: insets.top + 4,
          paddingBottom: insets.bottom + CONTENT_BOTTOM_PAD,
          paddingHorizontal: layout.padH,
        },
      ]}>
      <View style={styles.shrink}>
        <HomeHeader />
      </View>

      <View style={styles.shrink}>
        <HomeAnnouncementBar />
      </View>

      <View style={styles.heroSlot}>
        <DashboardHeroCard todayDay={todayDay} />
      </View>

      <View style={styles.shrink}>
        <StatsGrid />
      </View>

      <View style={[styles.pairRow, styles.flex1, { minHeight: PAIR_MIN_HEIGHT }]}>
        <View style={styles.pairCol}>
          <BodySimulationCard first={first} latest={latest} />
        </View>
        <View style={styles.pairCol}>
          <CompactProgressCard />
        </View>
      </View>

      <View style={styles.shrink}>
        <ShortcutGrid />
      </View>

      <View style={styles.shrink}>
        <MotivationCard />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#05070A',
    overflow: 'hidden',
    gap: HOME_GAP,
  },
  shrink: {
    flexShrink: 0,
  },
  heroSlot: {
    flexShrink: 1,
    minHeight: 0,
  },
  flex1: {
    flex: 1,
    minHeight: 0,
  },
  pairRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: HOME_GAP,
  },
  pairCol: {
    flex: 1,
    minWidth: 0,
    minHeight: 0,
    alignSelf: 'stretch',
  },
});
