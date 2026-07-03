import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { DIET_SCREEN } from '@/lib/dietDefaults';

export function DietTipBanner({ compact = false }: { compact?: boolean }) {
  return (
    <LinearGradient
      colors={['rgba(138,43,255,0.22)', 'rgba(7,11,18,0.95)']}
      style={[styles.card, compact && styles.cardCompact]}>
      <Ionicons name="flash" size={compact ? 12 : 18} color="#C084FC" />
      <View style={styles.text}>
        <Text style={styles.title}>BİLİYOR MUSUN?</Text>
        <Text style={styles.body} numberOfLines={compact ? 1 : 2}>{DIET_SCREEN.tip}</Text>
      </View>
      {!compact && (
        <Pressable style={styles.btn}>
          <Text style={styles.btnText}>Önerileri Gör ›</Text>
        </Pressable>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(168,85,247,0.3)',
    padding: 6,
    minHeight: 0,
  },
  cardCompact: { padding: 5 },
  text: { flex: 1, minWidth: 0 },
  title: { color: '#C084FC', fontSize: 6, fontWeight: '800' },
  body: { color: '#E2E8F0', fontSize: 7, fontWeight: '600', marginTop: 2 },
  btn: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(168,85,247,0.25)',
    borderWidth: 1,
    borderColor: 'rgba(168,85,247,0.4)',
  },
  btnText: { color: '#E9D5FF', fontSize: 7, fontWeight: '800' },
});
