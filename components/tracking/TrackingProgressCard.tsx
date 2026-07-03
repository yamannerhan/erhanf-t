import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProgressRing } from '@/components/ProgressRing';
import { TRACKING_SCREEN } from '@/lib/trackingDefaults';

interface TrackingProgressCardProps {
  period: 'week' | 'month';
  onPeriodChange: (p: 'week' | 'month') => void;
  compact?: boolean;
}

export function TrackingProgressCard({ period, onPeriodChange, compact = false }: TrackingProgressCardProps) {
  return (
    <View style={[styles.card, compact && styles.cardCompact]}>
      <View style={styles.headRow}>
        <Text style={styles.title}>İLERLEME</Text>
        <View style={styles.tabs}>
          {(['week', 'month'] as const).map((p) => (
            <Pressable key={p} style={[styles.tab, period === p && styles.tabActive]} onPress={() => onPeriodChange(p)}>
              <Text style={[styles.tabText, period === p && styles.tabTextActive]}>
                {p === 'week' ? 'Hafta' : 'Ay'}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Ionicons name="barbell" size={10} color="#A855F7" />
            <Text style={styles.statVal}>{TRACKING_SCREEN.workoutsWeek}</Text>
            <Text style={styles.statLbl}>Antrenman</Text>
          </View>
          <View style={styles.stat}>
            <Ionicons name="flame" size={10} color="#FF8C00" />
            <Text style={styles.statVal}>{TRACKING_SCREEN.caloriesWeek}</Text>
            <Text style={styles.statLbl}>Kalori</Text>
          </View>
        </View>
        <ProgressRing size={compact ? 44 : 72} stroke={4} progress={TRACKING_SCREEN.successRate / 100} color="#A855F7">
          <Text style={styles.ringPct}>%{TRACKING_SCREEN.successRate}</Text>
        </ProgressRing>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#070B12',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 8,
    minHeight: 0,
  },
  cardCompact: { padding: 6 },
  headRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  title: { color: '#9CA3AF', fontSize: 7, fontWeight: '800' },
  tabs: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.35)', borderRadius: 6, padding: 2 },
  tab: { paddingHorizontal: 6, paddingVertical: 3, borderRadius: 5 },
  tabActive: { backgroundColor: '#7C3AED' },
  tabText: { color: '#71717A', fontSize: 7, fontWeight: '700' },
  tabTextActive: { color: '#F8FAFC' },
  body: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  stats: { flex: 1, gap: 4 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statVal: { color: '#F8FAFC', fontSize: 10, fontWeight: '900' },
  statLbl: { color: '#71717A', fontSize: 6, fontWeight: '600' },
  ringPct: { color: '#F8FAFC', fontSize: 8, fontWeight: '900' },
});
