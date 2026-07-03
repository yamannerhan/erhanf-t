import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { MuscleMap } from '@/components/workout/MuscleMap';
import { PROGRAM_META } from '@/lib/workoutDefaults';
import type { WorkoutDay } from '@/lib/types';

interface ProgramDayCardProps {
  day: WorkoutDay;
  compact?: boolean;
}

export function ProgramDayCard({ day, compact = false }: ProgramDayCardProps) {
  const meta = PROGRAM_META[day.dayNumber] ?? {
    exercises: 6,
    duration: '60-75 dk',
    level: 'Orta Seviye',
    map: 'chest' as const,
  };
  const color = day.accentColor;

  const open = () => {
    router.push({ pathname: '/workout/[dayId]', params: { dayId: String(day.id) } });
  };

  return (
    <Pressable
      style={[styles.card, compact && styles.cardCompact, { borderLeftColor: color }]}
      onPress={open}>
      <View style={styles.left}>
        <Text style={[styles.dayNum, compact && styles.dayNumCompact, { color }]}>{day.title}</Text>
        <Text style={[styles.muscle, compact && styles.muscleCompact]} numberOfLines={1}>
          {day.muscleGroups}
        </Text>
        {!compact && (
          <View style={styles.metaRow}>
            <Text style={styles.meta}>{meta.exercises} Hareket</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.meta}>{meta.duration}</Text>
          </View>
        )}
        <Pressable style={styles.startBtn} onPress={open}>
          <LinearGradient colors={['#22C55E', '#16A34A']} style={[styles.startGrad, compact && styles.startGradCompact]}>
            <Ionicons name="play" size={8} color="#0a0a0a" />
            <Text style={styles.startText}>Başlat</Text>
          </LinearGradient>
        </Pressable>
      </View>
      <View style={styles.right}>
        {!compact && (
          <View style={[styles.levelBadge, { borderColor: color + '55', backgroundColor: color + '18' }]}>
            <Text style={[styles.levelText, { color }]}>{meta.level}</Text>
          </View>
        )}
        <MuscleMap zone={meta.map} color={color} width={compact ? 36 : 54} height={compact ? 52 : 78} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#070B12',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderLeftWidth: 4,
    padding: 8,
    overflow: 'hidden',
    minHeight: 0,
  },
  cardCompact: { padding: 6 },
  left: { flex: 1, minWidth: 0, justifyContent: 'center' },
  dayNum: { fontSize: 13, fontWeight: '900' },
  dayNumCompact: { fontSize: 11 },
  muscle: { color: '#F1F5F9', fontSize: 10, fontWeight: '700' },
  muscleCompact: { fontSize: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  meta: { color: '#9CA3AF', fontSize: 8, fontWeight: '600' },
  dot: { color: '#64748B', fontSize: 8 },
  startBtn: { alignSelf: 'flex-start', marginTop: 4 },
  startGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  startGradCompact: { paddingHorizontal: 6, paddingVertical: 3 },
  startText: { color: '#0a0a0a', fontSize: 8, fontWeight: '800' },
  right: { alignItems: 'center', justifyContent: 'center', width: 48 },
  levelBadge: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
    borderWidth: 1,
    marginBottom: 2,
  },
  levelText: { fontSize: 6, fontWeight: '800' },
});
