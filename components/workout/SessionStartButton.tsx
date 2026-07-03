import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SESSION_DEFAULTS } from '@/lib/sessionDefaults';

interface SessionStartButtonProps {
  onPress: () => void;
  compact?: boolean;
}

export function SessionStartButton({ onPress, compact = false }: SessionStartButtonProps) {
  return (
    <Pressable style={styles.wrap} onPress={onPress}>
      <LinearGradient
        colors={['#22C55E', '#84CC16', '#FFC400']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[styles.btn, compact && styles.btnCompact]}>
        <View style={[styles.play, compact && styles.playCompact]}>
          <Ionicons name="play" size={compact ? 12 : 16} color="#0a0a0a" />
        </View>
        <View style={styles.text}>
          <Text style={[styles.title, compact && styles.titleCompact]}>{SESSION_DEFAULTS.startTitle}</Text>
          {!compact && <Text style={styles.sub}>{SESSION_DEFAULTS.startSub}</Text>}
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, minHeight: 0, justifyContent: 'center' },
  btn: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 8 },
  btnCompact: { paddingVertical: 6 },
  play: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(0,0,0,0.25)', alignItems: 'center', justifyContent: 'center' },
  playCompact: { width: 24, height: 24, borderRadius: 12 },
  text: { flex: 1 },
  title: { color: '#0a0a0a', fontSize: 12, fontWeight: '900' },
  titleCompact: { fontSize: 10 },
  sub: { color: 'rgba(0,0,0,0.65)', fontSize: 7, fontWeight: '700', marginTop: 1 },
});
