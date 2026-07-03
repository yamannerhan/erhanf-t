import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Polyline } from 'react-native-svg';
import { ProgressRing } from '@/components/ProgressRing';
import { DIET_SCREEN, WEEKLY_CALORIES } from '@/lib/dietDefaults';

export function DietBottomCards({ compact = false }: { compact?: boolean }) {
  const max = Math.max(...WEEKLY_CALORIES);
  const points = WEEKLY_CALORIES.map((v, i) => {
    const x = 10 + (i / (WEEKLY_CALORIES.length - 1)) * 100;
    const y = 44 - (v / max) * 34;
    return `${x},${y}`;
  }).join(' ');

  const weightPct = 1 - (DIET_SCREEN.weightCurrent - DIET_SCREEN.weightTarget) / (DIET_SCREEN.weightCurrent - DIET_SCREEN.weightTarget + 13);

  return (
    <View style={styles.row}>
      <View style={styles.card}>
        <Text style={styles.title}>HAFTALIK</Text>
        <Svg width="100%" height={compact ? 28 : 50} viewBox="0 0 120 50">
          <Polyline points={points} fill="none" stroke="#A855F7" strokeWidth="2" />
          {WEEKLY_CALORIES.map((v, i) => {
            const x = 10 + (i / (WEEKLY_CALORIES.length - 1)) * 100;
            const y = 44 - (v / max) * 34;
            return <Circle key={i} cx={x} cy={y} r="2" fill="#C084FC" />;
          })}
        </Svg>
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>SKOR</Text>
        <View style={styles.scoreWrap}>
          <ProgressRing size={compact ? 36 : 54} stroke={4} progress={DIET_SCREEN.nutritionScore / 100} color="#22C55E">
            <Text style={styles.scoreVal}>{DIET_SCREEN.nutritionScore}</Text>
          </ProgressRing>
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>HEDEF</Text>
        <Text style={styles.goalLbl}>{DIET_SCREEN.weightTarget} kg</Text>
        <View style={styles.weightBar}>
          <View style={[styles.weightFill, { width: `${Math.min(weightPct * 100, 100)}%` }]} />
        </View>
        <Text style={styles.weightNow}>{DIET_SCREEN.weightCurrent} kg</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flex: 1, flexDirection: 'row', gap: 4, minHeight: 0 },
  card: {
    flex: 1,
    backgroundColor: '#070B12',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 5,
    minWidth: 0,
    minHeight: 0,
  },
  title: { color: '#9CA3AF', fontSize: 5, fontWeight: '800', marginBottom: 3 },
  scoreWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scoreVal: { color: '#F8FAFC', fontSize: 10, fontWeight: '900' },
  goalLbl: { color: '#A855F7', fontSize: 8, fontWeight: '800' },
  weightBar: { height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.08)', marginTop: 4, overflow: 'hidden' },
  weightFill: { height: '100%', backgroundColor: '#A855F7' },
  weightNow: { color: '#F8FAFC', fontSize: 8, fontWeight: '900', marginTop: 2 },
});
