import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SESSION_DEFAULTS } from '@/lib/sessionDefaults';

export function SessionTipBar({ compact = false }: { compact?: boolean }) {
  return (
    <View style={[styles.bar, compact && styles.barCompact]}>
      <Ionicons name="flash" size={10} color="#A855F7" />
      <Text style={styles.lbl}>İPUCU</Text>
      <Text style={styles.text} numberOfLines={1}>{SESSION_DEFAULTS.tip}</Text>
      {!compact && (
        <Pressable style={styles.btn}>
          <Text style={styles.btnText}>{SESSION_DEFAULTS.warmupCta} ›</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(138,43,255,0.12)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(168,85,247,0.25)',
    paddingHorizontal: 6,
    paddingVertical: 5,
    minHeight: 0,
  },
  barCompact: { paddingVertical: 4 },
  lbl: { color: '#A855F7', fontSize: 6, fontWeight: '800' },
  text: { flex: 1, color: '#CBD5E1', fontSize: 7, fontWeight: '600' },
  btn: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: 'rgba(168,85,247,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(168,85,247,0.35)',
  },
  btnText: { color: '#E9D5FF', fontSize: 6, fontWeight: '800' },
});
