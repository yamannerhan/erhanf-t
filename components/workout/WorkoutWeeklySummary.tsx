import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WORKOUT_SCREEN } from '@/lib/workoutDefaults';

const items = [
  { icon: 'barbell' as const, color: '#A855F7', value: String(WORKOUT_SCREEN.weeklySummary.completed), label: 'Tamamlanan\nAntrenman' },
  { icon: 'flame' as const, color: '#FF8C00', value: WORKOUT_SCREEN.weeklySummary.calories, label: 'Yakılan\nKalori' },
  { icon: 'time' as const, color: '#60A5FA', value: WORKOUT_SCREEN.weeklySummary.duration, label: 'Toplam\nSüre' },
  { icon: 'stats-chart' as const, color: '#22C55E', value: `%${WORKOUT_SCREEN.weeklySummary.successRate}`, label: 'Ortalama\nBaşarı' },
];

export function WorkoutWeeklySummary({ compact = false }: { compact?: boolean }) {
  return (
    <View style={[styles.wrap, compact && styles.wrapCompact]}>
      <Text style={styles.title}>HAFTALIK ÖZETİN</Text>
      <View style={styles.grid}>
        {items.map((item) => (
          <View key={item.label} style={styles.cell}>
            <Ionicons name={item.icon} size={compact ? 11 : 16} color={item.color} />
            <Text style={[styles.val, compact && styles.valCompact]}>{item.value}</Text>
            <Text style={[styles.lbl, compact && styles.lblCompact]}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: '#070B12',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 8,
    minHeight: 0,
  },
  wrapCompact: { padding: 6 },
  title: {
    color: '#9CA3AF',
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  grid: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  cell: { flex: 1, alignItems: 'center', gap: 2 },
  val: { color: '#F8FAFC', fontSize: 11, fontWeight: '900' },
  valCompact: { fontSize: 9 },
  lbl: { color: '#71717A', fontSize: 6, fontWeight: '600', textAlign: 'center', lineHeight: 7 },
  lblCompact: { fontSize: 5, lineHeight: 6 },
});
