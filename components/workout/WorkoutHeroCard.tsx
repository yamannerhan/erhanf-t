import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { WORKOUT_SCREEN } from '@/lib/workoutDefaults';

const HERO_IMAGE = require('@/assets/images/hero-athlete.jpg');

export function WorkoutHeroCard({ compact = false }: { compact?: boolean }) {
  const progress = WORKOUT_SCREEN.weeklyGoalDone / WORKOUT_SCREEN.weeklyGoalTotal;

  return (
    <View style={[styles.card, compact && styles.cardCompact]}>
      <ImageBackground source={HERO_IMAGE} style={[styles.bg, compact && styles.bgCompact]} imageStyle={styles.bgImage}>
        <LinearGradient
          colors={['rgba(5,7,10,0.55)', 'rgba(5,7,10,0.82)', 'rgba(5,7,10,0.95)']}
          style={StyleSheet.absoluteFill}
        />
        <View style={[styles.content, compact && styles.contentCompact]}>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Ionicons name="flame" size={compact ? 11 : 14} color="#FF8C00" />
              <Text style={[styles.statVal, compact && styles.statValCompact]}>{WORKOUT_SCREEN.streak}</Text>
              <Text style={styles.statLbl}>Gün Serisi</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="barbell" size={compact ? 11 : 14} color="#A855F7" />
              <Text style={[styles.statVal, compact && styles.statValCompact]}>{WORKOUT_SCREEN.totalWorkouts}</Text>
              <Text style={styles.statLbl}>Toplam Antrenman</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="time" size={compact ? 11 : 14} color="#A855F7" />
              <Text style={[styles.statVal, compact && styles.statValCompact]}>{WORKOUT_SCREEN.totalDuration}</Text>
              <Text style={styles.statLbl}>Toplam Süre</Text>
            </View>
          </View>

          <Text style={styles.goalLbl}>Bu haftaki hedefin</Text>
          <View style={styles.goalRow}>
            <Text style={[styles.goalNum, compact && styles.goalNumCompact]}>{WORKOUT_SCREEN.weeklyGoalDone}</Text>
            <Text style={styles.goalSlash}> / </Text>
            <Text style={[styles.goalTotal, compact && styles.goalTotalCompact]}>{WORKOUT_SCREEN.weeklyGoalTotal}</Text>
            <Text style={[styles.goalText, compact && styles.goalTextCompact]}> Antrenman</Text>
          </View>
          <View style={styles.barTrack}>
            <LinearGradient
              colors={['#A855F7', '#7C3AED']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={[styles.barFill, { width: `${progress * 100}%` }]}
            />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    minHeight: 0,
  },
  cardCompact: { minHeight: 0 },
  bg: { flex: 1, minHeight: 0 },
  bgCompact: { minHeight: 0 },
  bgImage: { borderRadius: 14 },
  content: { padding: 12, paddingTop: 10, flex: 1, justifyContent: 'center' },
  contentCompact: { padding: 8, paddingTop: 6 },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  stat: { flex: 1, alignItems: 'center', gap: 1 },
  statVal: { color: '#F8FAFC', fontSize: 13, fontWeight: '900' },
  statValCompact: { fontSize: 10, lineHeight: 12 },
  statLbl: { color: '#9CA3AF', fontSize: 7, fontWeight: '600', textAlign: 'center' },
  goalLbl: { color: '#9CA3AF', fontSize: 8, fontWeight: '600', marginBottom: 1 },
  goalRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 4 },
  goalNum: { color: '#A855F7', fontSize: 22, fontWeight: '900' },
  goalNumCompact: { fontSize: 16, lineHeight: 18 },
  goalSlash: { color: '#64748B', fontSize: 14, fontWeight: '700' },
  goalTotal: { color: '#E2E8F0', fontSize: 16, fontWeight: '800' },
  goalTotalCompact: { fontSize: 12 },
  goalText: { color: '#A855F7', fontSize: 14, fontWeight: '800' },
  goalTextCompact: { fontSize: 10 },
  barTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: 3 },
});
