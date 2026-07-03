import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ProgressRing } from '@/components/ProgressRing';
import { DIET_SCREEN } from '@/lib/dietDefaults';

export function DietCalorieCard({ compact = false }: { compact?: boolean }) {
  const pct = DIET_SCREEN.calorieCurrent / DIET_SCREEN.calorieGoal;
  const ring = compact ? 48 : 72;

  return (
    <LinearGradient
      colors={['rgba(138,43,255,0.2)', 'rgba(7,11,18,0.95)']}
      style={[styles.card, compact && styles.cardCompact]}>
      <Text style={styles.title}>GÜNLÜK KALORİ HEDEFİN</Text>
      <View style={styles.row}>
        <ProgressRing size={ring} stroke={compact ? 4 : 6} progress={pct} color="#A855F7">
          <Text style={styles.ringPct}>{Math.round(pct * 100)}%</Text>
        </ProgressRing>
        <View style={styles.macros}>
          <MacroBar label="P" current={DIET_SCREEN.protein.current} goal={DIET_SCREEN.protein.goal} color={DIET_SCREEN.protein.color} compact={compact} />
          <MacroBar label="K" current={DIET_SCREEN.carb.current} goal={DIET_SCREEN.carb.goal} color={DIET_SCREEN.carb.color} compact={compact} />
          <MacroBar label="Y" current={DIET_SCREEN.fat.current} goal={DIET_SCREEN.fat.goal} color={DIET_SCREEN.fat.color} compact={compact} />
        </View>
        <View style={styles.remain}>
          <Ionicons name="flame" size={10} color="#FF8C00" />
          <Text style={styles.remainVal}>{DIET_SCREEN.remainingCalories}</Text>
          <Text style={styles.remainLbl}>kcal kaldı</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

function MacroBar({ label, current, goal, color, compact }: { label: string; current: number; goal: number; color: string; compact?: boolean }) {
  return (
    <View style={styles.macroRow}>
      <Text style={styles.macroLbl}>{label} {current}/{goal}g</Text>
      <View style={styles.macroTrack}>
        <View style={[styles.macroFill, { width: `${(current / goal) * 100}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(168,85,247,0.35)', padding: 10, minHeight: 0 },
  cardCompact: { padding: 6 },
  title: { color: '#C084FC', fontSize: 7, fontWeight: '800', marginBottom: 4 },
  row: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  macros: { flex: 1, gap: 3 },
  macroRow: { gap: 2 },
  macroLbl: { color: '#9CA3AF', fontSize: 6, fontWeight: '700' },
  macroTrack: { height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' },
  macroFill: { height: '100%' },
  remain: { alignItems: 'center', width: 44 },
  remainVal: { color: '#F8FAFC', fontSize: 12, fontWeight: '900' },
  remainLbl: { color: '#9CA3AF', fontSize: 5, fontWeight: '600' },
  ringPct: { color: '#A855F7', fontSize: 9, fontWeight: '900' },
});
