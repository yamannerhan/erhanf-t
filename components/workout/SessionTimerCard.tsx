import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface SessionTimerCardProps {
  elapsed: string;
  completed: number;
  total: number;
  compact?: boolean;
}

export function SessionTimerCard({ elapsed, completed, total, compact = false }: SessionTimerCardProps) {
  const progress = total > 0 ? completed / total : 0;

  return (
    <LinearGradient
      colors={['rgba(138,43,255,0.18)', 'rgba(7,11,18,0.95)']}
      style={[styles.card, compact && styles.cardCompact]}>
      <View style={styles.top}>
        <View>
          <Text style={styles.lbl}>SÜRE</Text>
          <Text style={[styles.time, compact && styles.timeCompact]}>{elapsed}</Text>
        </View>
        <Ionicons name="timer-outline" size={compact ? 18 : 28} color="#A855F7" />
      </View>
      <View style={styles.barTrack}>
        <LinearGradient
          colors={['#A855F7', '#7C3AED']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[styles.barFill, { width: `${Math.max(progress * 100, 4)}%` }]}
        />
      </View>
      <Text style={styles.progress}>{completed} / {total} hareket</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(168,85,247,0.35)',
    padding: 8,
    minHeight: 0,
  },
  cardCompact: { padding: 6 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lbl: { color: '#A855F7', fontSize: 7, fontWeight: '800' },
  time: { color: '#F8FAFC', fontSize: 22, fontWeight: '900', fontVariant: ['tabular-nums'] },
  timeCompact: { fontSize: 16 },
  barTrack: { height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.08)', marginTop: 4, overflow: 'hidden' },
  barFill: { height: '100%' },
  progress: { color: '#A855F7', fontSize: 7, fontWeight: '700', marginTop: 3 },
});
