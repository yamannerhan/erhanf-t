import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MuscleMap } from '@/components/workout/MuscleMap';
import { getSessionMeta } from '@/lib/sessionDefaults';

interface SessionMuscleTargetsProps {
  dayNumber: number;
  color: string;
  compact?: boolean;
}

export function SessionMuscleTargets({ dayNumber, color, compact = false }: SessionMuscleTargetsProps) {
  const meta = getSessionMeta(dayNumber);
  const w = compact ? 32 : 64;
  const h = compact ? 46 : 92;

  return (
    <View style={[styles.card, compact && styles.cardCompact]}>
      <View style={styles.head}>
        <Ionicons name="body" size={10} color="#A855F7" />
        <Text style={styles.title}>ÇALIŞILACAK BÖLGELER</Text>
      </View>
      <View style={styles.maps}>
        <MuscleMap zone={meta.map} color={color} width={w} height={h} />
        <MuscleMap zone={meta.map} color={color} width={w} height={h} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#070B12',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 6,
    minHeight: 0,
  },
  cardCompact: { padding: 4 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 },
  title: { color: '#9CA3AF', fontSize: 7, fontWeight: '800' },
  maps: { flex: 1, flexDirection: 'row', justifyContent: 'center', gap: 12, alignItems: 'center' },
});
