import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SESSION_DEFAULTS } from '@/lib/sessionDefaults';

interface SessionStatsRowProps {
  exerciseCount: number;
  compact?: boolean;
}

export function SessionStatsRow({ exerciseCount, compact = false }: SessionStatsRowProps) {
  const items = [
    { icon: 'barbell' as const, color: '#A855F7', val: String(exerciseCount), lbl: 'HAREKET' },
    { icon: 'time' as const, color: '#60A5FA', val: SESSION_DEFAULTS.duration, lbl: 'SÜRE' },
    { icon: 'stats-chart' as const, color: '#22C55E', val: SESSION_DEFAULTS.difficulty, lbl: 'ZORLUK' },
    { icon: 'timer' as const, color: '#FFC400', val: SESSION_DEFAULTS.restBetween, lbl: 'DİNLENME' },
  ];

  return (
    <View style={[styles.row, compact && styles.rowCompact]}>
      {items.map((item) => (
        <View key={item.lbl} style={styles.cell}>
          <Ionicons name={item.icon} size={compact ? 10 : 14} color={item.color} />
          <Text style={[styles.val, compact && styles.valCompact]}>{item.val}</Text>
          <Text style={styles.lbl}>{item.lbl}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#070B12',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 6,
    minHeight: 0,
  },
  rowCompact: { paddingVertical: 4 },
  cell: { flex: 1, alignItems: 'center', gap: 1 },
  val: { color: '#F8FAFC', fontSize: 8, fontWeight: '900', textAlign: 'center' },
  valCompact: { fontSize: 7 },
  lbl: { color: '#9CA3AF', fontSize: 5, fontWeight: '800' },
});
