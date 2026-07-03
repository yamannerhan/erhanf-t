import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { WORKOUT_SCREEN } from '@/lib/workoutDefaults';

export function WorkoutRecommendation({ compact = false }: { compact?: boolean }) {
  return (
    <LinearGradient
      colors={['rgba(138,43,255,0.25)', 'rgba(88,28,135,0.15)']}
      style={[styles.card, compact && styles.cardCompact]}>
      <Ionicons name="flash" size={compact ? 12 : 18} color="#C084FC" />
      <View style={styles.textWrap}>
        <Text style={styles.heading}>SANA ÖZEL ÖNERİ</Text>
        <Text style={[styles.body, compact && styles.bodyCompact]} numberOfLines={compact ? 2 : 3}>
          {WORKOUT_SCREEN.recommendation.text}
        </Text>
      </View>
      {!compact && (
        <Pressable style={styles.btn} onPress={() => router.push('/(tabs)/index' as never)}>
          <Text style={styles.btnText}>{WORKOUT_SCREEN.recommendation.cta}</Text>
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
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(168,85,247,0.35)',
    padding: 8,
    gap: 6,
    minHeight: 0,
  },
  cardCompact: { padding: 6 },
  textWrap: { flex: 1, minWidth: 0 },
  heading: {
    color: '#C084FC',
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  body: { color: '#E2E8F0', fontSize: 9, fontWeight: '600', lineHeight: 11 },
  bodyCompact: { fontSize: 7, lineHeight: 9 },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(168,85,247,0.25)',
    borderWidth: 1,
    borderColor: 'rgba(168,85,247,0.4)',
  },
  btnText: { color: '#E9D5FF', fontSize: 9, fontWeight: '800' },
});
