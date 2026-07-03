import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

const WATER_BOTTLE = require('@/assets/images/water-bottle.png');

interface TrackingWaterCardProps {
  totalMl: number;
  onAdd: (ml: number) => void;
  onRemove: (ml: number) => void;
  onClear: () => void;
  compact?: boolean;
}

export function TrackingWaterCard({ totalMl, onAdd, onRemove, onClear, compact = false }: TrackingWaterCardProps) {
  const liters = (totalMl / 1000).toFixed(1);
  const goalL = (theme.waterGoalMl / 1000).toFixed(1);
  const pct = Math.round(Math.min(totalMl / theme.waterGoalMl, 1) * 100);

  return (
    <View style={[styles.card, compact && styles.cardCompact]}>
      <View style={styles.head}>
        <View style={styles.titleRow}>
          <Ionicons name="water" size={12} color="#60A5FA" />
          <Text style={styles.title}>SU TAKİBİ</Text>
        </View>
        <Text style={styles.amount}>{liters} / {goalL} L</Text>
      </View>

      <View style={styles.mid}>
        <View style={styles.barWrap}>
          <View style={styles.barTrack}>
            <LinearGradient
              colors={['#2563EB', '#60A5FA', '#A855F7']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={[styles.barFill, { width: `${pct}%` }]}
            />
          </View>
          <Text style={styles.pct}>{pct}%</Text>
        </View>
        {!compact && (
          <View style={styles.bottleWrap}>
            <Image source={WATER_BOTTLE} style={styles.bottle} resizeMode="contain" />
          </View>
        )}
      </View>

      <View style={styles.row}>
        {[250, 500, 750].map((ml) => (
          <Pressable key={`a${ml}`} style={styles.addBtn} onPress={() => onAdd(ml)}>
            <Ionicons name="add" size={9} color="#60A5FA" />
            <Text style={styles.addText}>+{ml}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.row}>
        {[250, 500, 750].map((ml) => (
          <Pressable
            key={`r${ml}`}
            style={[styles.removeBtn, totalMl < ml && styles.disabled]}
            onPress={() => totalMl > 0 && onRemove(ml)}
            disabled={totalMl <= 0}>
            <Ionicons name="remove" size={9} color="#FF4D6D" />
            <Text style={styles.removeText}>-{ml}</Text>
          </Pressable>
        ))}
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
    borderColor: 'rgba(96,165,250,0.3)',
    padding: 8,
    minHeight: 0,
  },
  cardCompact: { padding: 6 },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  title: { color: '#F8FAFC', fontSize: 9, fontWeight: '800' },
  amount: { color: '#60A5FA', fontSize: 9, fontWeight: '800' },
  mid: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  barWrap: { flex: 1 },
  barTrack: { height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' },
  barFill: { height: '100%' },
  pct: { color: '#A855F7', fontSize: 7, fontWeight: '800', marginTop: 2 },
  bottleWrap: { width: 32, height: 40, alignItems: 'center', justifyContent: 'center' },
  bottle: { width: 28, height: 38 },
  row: { flexDirection: 'row', gap: 4, marginBottom: 2 },
  addBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.4)',
    backgroundColor: 'rgba(96,165,250,0.1)',
  },
  addText: { color: '#60A5FA', fontSize: 7, fontWeight: '800' },
  removeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,77,109,0.4)',
    backgroundColor: 'rgba(255,77,109,0.08)',
  },
  removeText: { color: '#FF4D6D', fontSize: 7, fontWeight: '800' },
  disabled: { opacity: 0.35 },
});
