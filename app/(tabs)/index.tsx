import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/components/AppProvider';
import { BodySimulationCard } from '@/components/home/BodySimulationCard';
import { CompactProgressCard } from '@/components/home/CompactProgressCard';
import { DailyProgressCard } from '@/components/home/DailyProgressCard';
import { DashboardHeroCard } from '@/components/home/DashboardHeroCard';
import { HomeAnnouncementBar } from '@/components/home/HomeAnnouncementBar';
import { HomeHeader } from '@/components/home/HomeHeader';
import { MotivationCard } from '@/components/home/MotivationCard';
import { ShortcutGrid } from '@/components/home/ShortcutGrid';
import { StatsGrid } from '@/components/home/StatsGrid';
import { TodayPlan } from '@/components/home/TodayPlan';
import { WaterGoalCard } from '@/components/home/WaterGoalCard';
import { DASHBOARD } from '@/lib/dashboardDefaults';
import {
  getFirstMeasurement,
  getLatestMeasurement,
  getWorkoutDays,
} from '@/lib/database';
import type { BodyMeasurement, WorkoutDay } from '@/lib/types';

function Slot({
  flex,
  children,
  row,
}: {
  flex: number;
  children: ReactNode;
  row?: boolean;
}) {
  return (
    <View style={[styles.slot, { flex }, row && styles.slotRow]}>{children}</View>
  );
}

export default function HomeScreen() {
  const { ready, refreshKey } = useApp();
  const insets = useSafeAreaInsets();
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
    <View style={styles.root}>
      <View
        style={[
          styles.screen,
          { paddingTop: insets.top + 1, paddingBottom: insets.bottom + 52 },
        ]}>
        <HomeHeader />
        <HomeAnnouncementBar />

        <View style={styles.body}>
          <Slot flex={20}>
            <DashboardHeroCard todayDay={todayDay} />
          </Slot>

          <Slot flex={9}>
            <StatsGrid />
          </Slot>

          <Slot flex={16} row>
            <BodySimulationCard first={first} latest={latest} />
            <CompactProgressCard />
          </Slot>

          <Slot flex={9}>
            <ShortcutGrid />
          </Slot>

          <Slot flex={32}>
            <View style={styles.bottomWrap}>
              <View style={styles.bottomRow}>
                <View style={styles.bottomCol}>
                  <TodayPlan />
                </View>
                <View style={styles.bottomCol}>
                  <WaterGoalCard />
                </View>
                <View style={styles.bottomCol}>
                  <DailyProgressCard />
                </View>
              </View>
              <View style={styles.quoteRow}>
                <View style={styles.quoteSpacerTop} />
                <MotivationCard />
                <View style={styles.quoteSpacerBottom} />
              </View>
            </View>
          </Slot>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#05070A', overflow: 'hidden' },
  screen: {
    flex: 1,
    paddingHorizontal: 10,
  },
  body: {
    flex: 1,
    gap: 4,
    minHeight: 0,
  },
  slot: {
    minHeight: 0,
    overflow: 'hidden',
  },
  slotRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 5,
  },
  bottomWrap: {
    flex: 1,
    flexDirection: 'column',
    minHeight: 0,
  },
  bottomRow: {
    flex: 62,
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 4,
    minHeight: 0,
    marginBottom: 4,
  },
  quoteRow: {
    flex: 38,
    minHeight: 56,
    minWidth: 0,
    flexDirection: 'column',
  },
  quoteSpacerTop: {
    flex: 1.35,
    minHeight: 4,
  },
  quoteSpacerBottom: {
    flex: 0.45,
    minHeight: 2,
  },
  bottomCol: {
    flex: 1,
    minWidth: 0,
    minHeight: 0,
    overflow: 'hidden',
  },
});
