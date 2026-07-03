import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { SESSION_DEFAULTS } from '@/lib/sessionDefaults';
import type { Exercise } from '@/lib/types';

const BADGE_COLORS = ['#A855F7', '#22C55E', '#FFC400', '#A855F7', '#22C55E', '#FFC400'];

interface SessionExerciseRowProps {
  exercise: Exercise;
  index: number;
  accentColor: string;
  completed?: boolean;
  active?: boolean;
  onComplete?: () => void;
  compact?: boolean;
}

export function SessionExerciseRow({
  exercise,
  index,
  accentColor,
  completed = false,
  active = false,
  onComplete,
  compact = false,
}: SessionExerciseRowProps) {
  const badgeColor = BADGE_COLORS[index % BADGE_COLORS.length];
  const rest = SESSION_DEFAULTS.exerciseRest[index] ?? 60;

  return (
    <Pressable
      style={[styles.row, compact && styles.rowCompact, active && styles.rowActive, completed && styles.rowDone]}
      onPress={onComplete}
      disabled={!onComplete || completed}>
      <View style={[styles.badge, compact && styles.badgeCompact, { backgroundColor: completed ? '#22C55E' : badgeColor }]}>
        {completed ? (
          <Ionicons name="checkmark" size={compact ? 8 : 12} color="#0a0a0a" />
        ) : (
          <Text style={[styles.badgeNum, compact && styles.badgeNumCompact]}>{index + 1}</Text>
        )}
      </View>

      <View style={styles.main}>
        {!compact && (
          <View style={styles.thumbs}>
            {[0, 1, 2].map((i) => (
              <Image key={i} source={{ uri: exercise.cropUri }} style={styles.thumb} contentFit="cover" />
            ))}
          </View>
        )}
        <View style={styles.info}>
          <Text style={[styles.name, compact && styles.nameCompact]} numberOfLines={1}>
            {exercise.name.toUpperCase()}
          </Text>
          <Text style={styles.sets}>{exercise.sets} x {exercise.reps}</Text>
        </View>
      </View>

      <View style={[styles.rest, compact && styles.restCompact]}>
        <Text style={styles.restVal}>{rest}s</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#070B12',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 6,
    gap: 4,
    minHeight: 0,
  },
  rowCompact: { padding: 4 },
  rowActive: { borderColor: 'rgba(168,85,247,0.55)', backgroundColor: 'rgba(138,43,255,0.08)' },
  rowDone: { opacity: 0.75 },
  badge: { width: 20, height: 20, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  badgeCompact: { width: 16, height: 16, borderRadius: 4 },
  badgeNum: { color: '#0a0a0a', fontSize: 10, fontWeight: '900' },
  badgeNumCompact: { fontSize: 8 },
  main: { flex: 1, flexDirection: 'row', gap: 4, minWidth: 0 },
  thumbs: { flexDirection: 'row', gap: 2 },
  thumb: { width: 20, height: 26, borderRadius: 4, backgroundColor: '#1E293B' },
  info: { flex: 1, minWidth: 0, justifyContent: 'center' },
  name: { color: '#F8FAFC', fontSize: 8, fontWeight: '900' },
  nameCompact: { fontSize: 7 },
  sets: { color: '#9CA3AF', fontSize: 6, fontWeight: '700' },
  rest: {
    width: 28,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 6,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  restCompact: { width: 24 },
  restVal: { color: '#E2E8F0', fontSize: 7, fontWeight: '800' },
});
