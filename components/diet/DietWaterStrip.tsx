import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { DIET_SCREEN } from '@/lib/dietDefaults';

export function DietWaterStrip({ compact = false }: { compact?: boolean }) {
  const filled = Math.round((DIET_SCREEN.waterPct / 100) * 8);

  return (
    <View style={[styles.card, compact && styles.cardCompact]}>
      <View style={styles.left}>
        <Ionicons name="water" size={compact ? 12 : 18} color="#60A5FA" />
        <View>
          <Text style={styles.title}>SU TÜKETİMİ</Text>
          <Text style={styles.val}>
            {DIET_SCREEN.waterCurrent} / {DIET_SCREEN.waterGoal} L
          </Text>
        </View>
      </View>
      <View style={styles.glasses}>
        {Array.from({ length: 8 }).map((_, i) => (
          <View key={i} style={[styles.glass, i < filled && styles.glassFilled]} />
        ))}
      </View>
      <Pressable style={styles.addBtn} onPress={() => router.push('/water')}>
        <LinearGradient colors={['#2563EB', '#60A5FA']} style={styles.addGrad}>
          <Ionicons name="add" size={10} color="#fff" />
          {!compact && <Text style={styles.addText}>Su Ekle</Text>}
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#070B12',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 6,
    gap: 4,
    minHeight: 0,
  },
  cardCompact: { padding: 5 },
  left: { flexDirection: 'row', alignItems: 'center', gap: 4, width: 90 },
  title: { color: '#9CA3AF', fontSize: 6, fontWeight: '800' },
  val: { color: '#F8FAFC', fontSize: 9, fontWeight: '800' },
  glasses: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 2, justifyContent: 'center' },
  glass: {
    width: 8,
    height: 12,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.35)',
  },
  glassFilled: { backgroundColor: 'rgba(96,165,250,0.65)' },
  addBtn: { borderRadius: 6, overflow: 'hidden' },
  addGrad: { flexDirection: 'row', alignItems: 'center', gap: 2, paddingHorizontal: 6, paddingVertical: 4 },
  addText: { color: '#fff', fontSize: 7, fontWeight: '800' },
});
