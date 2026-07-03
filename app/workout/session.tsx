import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { TabSlot } from '@/components/layout/TabScreenShell';
import { SessionExerciseRow } from '@/components/workout/SessionExerciseRow';
import { SessionMuscleTargets } from '@/components/workout/SessionMuscleTargets';
import { SessionStartHeader } from '@/components/workout/SessionStartHeader';
import { SessionStatsRow } from '@/components/workout/SessionStatsRow';
import { SessionTimerCard } from '@/components/workout/SessionTimerCard';
import { SessionTipBar } from '@/components/workout/SessionTipBar';
import { useWorkoutTimer } from '@/components/WorkoutTimer';
import {
  endWorkoutSession,
  getExercises,
  getWorkoutDay,
  resetExerciseCompletion,
  setExerciseCompleted,
  startWorkoutSession,
} from '@/lib/database';
import { addDailyCalories, getStreakDays, setStreakDays } from '@/lib/appMeta';
import type { Exercise, WorkoutDay } from '@/lib/types';

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

export default function WorkoutSessionScreen() {
  const { dayId } = useLocalSearchParams<{ dayId: string }>();
  const insets = useSafeAreaInsets();
  const timer = useWorkoutTimer();
  const [day, setDay] = useState<WorkoutDay | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const load = useCallback(async () => {
    const id = Number(dayId);
    await resetExerciseCompletion(id);
    const [d, e, sid] = await Promise.all([
      getWorkoutDay(id),
      getExercises(id),
      startWorkoutSession(id),
    ]);
    setDay(d);
    setExercises(e);
    setSessionId(sid);
    timer.start();
  }, [dayId]);

  useEffect(() => {
    load();
    return () => timer.stop();
  }, [load]);

  const handleComplete = async (exercise: Exercise, index: number) => {
    await setExerciseCompleted(exercise.id, true);
    const updated = [...exercises];
    updated[index] = { ...exercise, completed: 1 };
    setExercises(updated);

    if (index < exercises.length - 1) {
      setActiveIndex(index + 1);
    } else {
      timer.stop();
      if (sessionId) {
        await endWorkoutSession(sessionId, timer.seconds);
      }
      await addDailyCalories(todayStr(), 520);
      const streak = await getStreakDays();
      await setStreakDays(streak + 1);
      setFinished(true);
    }
  };

  const handleClose = () => {
    timer.stop();
    router.back();
  };

  if (!day) return null;

  if (finished) {
    return (
      <View style={[styles.root, { paddingTop: insets.top + 20 }]}>
        <LinearGradient colors={['rgba(138,43,255,0.2)', '#05070A']} style={StyleSheet.absoluteFill} />
        <View style={styles.finishCard}>
          <Ionicons name="trophy" size={64} color="#FFC400" />
          <Text style={styles.finishTitle}>Tebrikler!</Text>
          <Text style={styles.finishSub}>{day.title} antrenmanını tamamladın</Text>
          <Text style={styles.finishTime}>Süre: {timer.formatted}</Text>
          <Pressable style={styles.doneBtn} onPress={handleClose}>
            <Text style={styles.doneText}>Tamam</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const completedCount = exercises.filter((e) => e.completed === 1).length;

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom + 8 }]}>
      <View style={styles.headerSlot}>
        <SessionStartHeader day={day} compact onClose={handleClose} />
      </View>
      <View style={styles.body}>
        <TabSlot flex={14}>
          <SessionTimerCard compact elapsed={timer.formatted} completed={completedCount} total={exercises.length} />
        </TabSlot>
        <TabSlot flex={8}>
          <SessionStatsRow compact exerciseCount={exercises.length} />
        </TabSlot>
        <TabSlot flex={10}>
          <SessionMuscleTargets compact dayNumber={day.dayNumber} color={day.accentColor} />
        </TabSlot>
        <TabSlot flex={58}>
          <Text style={styles.sectionTitle}>HAREKETLERİN</Text>
          <View style={styles.exerciseList}>
            {exercises.map((ex, i) => (
              <View key={ex.id} style={styles.exerciseSlot}>
                <SessionExerciseRow
                  exercise={ex}
                  index={i}
                  accentColor={day.accentColor}
                  completed={ex.completed === 1}
                  active={i === activeIndex && ex.completed !== 1}
                  compact
                  onComplete={
                    i === activeIndex && ex.completed !== 1
                      ? () => handleComplete(ex, i)
                      : undefined
                  }
                />
              </View>
            ))}
          </View>
        </TabSlot>
        <TabSlot flex={10}>
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
  finishCard: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  finishTitle: { color: '#F8FAFC', fontSize: 32, fontWeight: '900', marginTop: 16 },
  finishSub: { color: '#9CA3AF', fontSize: 16, marginTop: 8, textAlign: 'center' },
  finishTime: { color: '#22C55E', fontSize: 24, fontWeight: '800', marginTop: 16 },
  doneBtn: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 32,
  },
  doneText: { color: '#0a0a0a', fontWeight: '800', fontSize: 17 },
});
