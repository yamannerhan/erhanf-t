import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TabSlot } from '@/components/layout/TabScreenShell';
import { SessionExerciseRow } from '@/components/workout/SessionExerciseRow';
import { SessionMuscleTargets } from '@/components/workout/SessionMuscleTargets';
import { SessionStartButton } from '@/components/workout/SessionStartButton';
import { SessionStartHeader } from '@/components/workout/SessionStartHeader';
import { SessionStatsRow } from '@/components/workout/SessionStatsRow';
import { SessionTimerCard } from '@/components/workout/SessionTimerCard';
import { SessionTipBar } from '@/components/workout/SessionTipBar';
import { getExercises, getWorkoutDay } from '@/lib/database';
import type { Exercise, WorkoutDay } from '@/lib/types';

function formatElapsed(sec: number) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function WorkoutDayScreen() {
  const { dayId } = useLocalSearchParams<{ dayId: string }>();
  const insets = useSafeAreaInsets();
  const [day, setDay] = useState<WorkoutDay | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [previewSec, setPreviewSec] = useState(10);

  const load = useCallback(async () => {
    const id = Number(dayId);
    const [d, e] = await Promise.all([getWorkoutDay(id), getExercises(id)]);
    setDay(d);
    setExercises(e);
  }, [dayId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const t = setInterval(() => {
      setPreviewSec((s) => (s >= 59 ? 10 : s + 1));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  if (!day) return null;

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom + 8 }]}>
      <View style={styles.headerSlot}>
        <SessionStartHeader day={day} compact onClose={() => router.back()} />
      </View>

      <View style={styles.body}>
        <TabSlot flex={16}>
          <SessionTimerCard
            compact
            elapsed={formatElapsed(previewSec)}
            completed={0}
            total={exercises.length}
          />
        </TabSlot>
        <TabSlot flex={9}>
          <SessionStatsRow compact exerciseCount={exercises.length} />
        </TabSlot>
        <TabSlot flex={12}>
          <SessionMuscleTargets compact dayNumber={day.dayNumber} color={day.accentColor} />
        </TabSlot>
        <TabSlot flex={44}>
          <Text style={styles.sectionTitle}>HAREKETLERİN</Text>
          <View style={styles.exerciseList}>
            {exercises.map((ex, i) => (
              <View key={ex.id} style={styles.exerciseSlot}>
                <SessionExerciseRow exercise={ex} index={i} accentColor={day.accentColor} compact />
              </View>
            ))}
          </View>
        </TabSlot>
        <TabSlot flex={11}>
          <SessionStartButton
            compact
            onPress={() =>
              router.push({ pathname: '/workout/session', params: { dayId: String(day.id) } })
            }
          />
        </TabSlot>
        <TabSlot flex={8}>
          <SessionTipBar compact />
        </TabSlot>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#05070A', overflow: 'hidden' },
  headerSlot: { paddingHorizontal: 10, flexShrink: 0 },
  body: { flex: 1, paddingHorizontal: 10, gap: 3, minHeight: 0 },
  sectionTitle: {
    color: '#9CA3AF',
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 2,
    flexShrink: 0,
  },
  exerciseList: { flex: 1, gap: 2, minHeight: 0 },
  exerciseSlot: { flex: 1, minHeight: 0 },
});
