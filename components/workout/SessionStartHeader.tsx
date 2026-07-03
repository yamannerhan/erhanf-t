import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SESSION_DEFAULTS } from '@/lib/sessionDefaults';
import type { WorkoutDay } from '@/lib/types';

interface SessionStartHeaderProps {
  day: WorkoutDay;
  onClose: () => void;
  compact?: boolean;
}

export function SessionStartHeader({ day, onClose, compact = false }: SessionStartHeaderProps) {
  const muscle = day.muscleGroups.toUpperCase();

  return (
    <View style={[styles.wrap, compact && styles.wrapCompact]}>
      <Pressable style={[styles.closeBtn, compact && styles.closeBtnCompact]} onPress={onClose}>
        <Ionicons name="close" size={compact ? 14 : 18} color="#F8FAFC" />
      </Pressable>
      <View style={styles.center}>
        <Text style={[styles.dayTag, { color: day.accentColor }]}>{day.title.toUpperCase()}</Text>
        <Text style={[styles.muscle, compact && styles.muscleCompact]} numberOfLines={1}>{muscle}</Text>
      </View>
      <View style={[styles.burn, compact && styles.burnCompact]}>
        <Ionicons name="flame" size={10} color="#FF8C00" />
        <Text style={styles.burnVal}>{SESSION_DEFAULTS.burnKcal}</Text>
        <Text style={styles.burnSub}>kcal</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 4, marginBottom: 4 },
  wrapCompact: { marginBottom: 2 },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnCompact: { width: 24, height: 24 },
  center: { flex: 1, alignItems: 'center', paddingHorizontal: 4, minWidth: 0 },
  dayTag: { fontSize: 8, fontWeight: '800', letterSpacing: 0.5 },
  muscle: { color: '#F8FAFC', fontSize: 14, fontWeight: '900', marginTop: 1 },
  muscleCompact: { fontSize: 11 },
  burn: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,140,0,0.3)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    minWidth: 44,
  },
  burnCompact: { minWidth: 38 },
  burnVal: { color: '#F8FAFC', fontSize: 9, fontWeight: '900' },
  burnSub: { color: '#71717A', fontSize: 5, fontWeight: '600' },
});
