import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ProgressRing } from '@/components/ProgressRing';
import { DASHBOARD } from '@/lib/dashboardDefaults';

export function DailyProgressCard() {
  return (
    <Pressable style={styles.card} onPress={() => router.push('/stats' as never)}>
      <View style={styles.inner}>
        <View style={styles.main}>
          <Text style={styles.title}>GÜNLÜK İLERLEME</Text>

          <View style={styles.ringWrap}>
            <ProgressRing
              size={34}
              stroke={3.5}
              progress={DASHBOARD.dailyProgress / 100}
              color="#A855F7">
              <View style={styles.ringCenter}>
                <Text style={styles.ringPct}>{DASHBOARD.dailyProgress}%</Text>
                <Text style={styles.ringLbl}>Tamamlandı</Text>
              </View>
            </ProgressRing>
          </View>

          <View style={styles.tasks}>
            {DASHBOARD.dailyTasks.map((task) => (
              <View key={task.id} style={styles.taskRow}>
                <View style={[styles.taskCheck, task.done && styles.taskCheckDone]}>
                  {task.done && <Ionicons name="checkmark" size={6} color="#0a0a0a" />}
                </View>
                <Text style={[styles.taskLabel, task.done && styles.taskLabelDone]} numberOfLines={1}>
                  {task.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <LinearGradient
          colors={['rgba(255,196,0,0.22)', 'rgba(255,107,53,0.14)']}
          style={styles.streakCard}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <View style={styles.streakText}>
            <Text style={styles.streakTitle} numberOfLines={1}>
              {DASHBOARD.streak} Gün Serisi
            </Text>
            <Text style={styles.streakSub} numberOfLines={1}>
              {DASHBOARD.streakSubtitle}
            </Text>
          </View>
        </LinearGradient>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignSelf: 'stretch',
  },
  inner: {
    flex: 1,
    alignSelf: 'stretch',
    flexDirection: 'column',
    backgroundColor: '#070B12',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 5,
    paddingTop: 5,
    paddingBottom: 5,
    minWidth: 0,
    minHeight: 0,
  },
  main: {
    flex: 1,
    minHeight: 0,
    overflow: 'hidden',
  },
  title: {
    color: '#B8BBC7',
    fontSize: 7,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 1,
    flexShrink: 0,
  },
  ringWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
    flexShrink: 0,
  },
  ringCenter: { alignItems: 'center' },
  ringPct: {
    color: '#F8FAFC',
    fontSize: 9,
    fontWeight: '900',
    lineHeight: 11,
  },
  ringLbl: {
    color: '#9CA3AF',
    fontSize: 5,
    fontWeight: '700',
  },
  tasks: {
    flexShrink: 1,
    gap: 2,
    marginTop: 1,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    minHeight: 11,
  },
  taskCheck: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  taskCheckDone: {
    backgroundColor: '#22C55E',
    borderColor: '#22C55E',
  },
  taskLabel: {
    color: '#71717A',
    fontSize: 6,
    fontWeight: '600',
    flex: 1,
    minWidth: 0,
  },
  taskLabelDone: {
    color: '#E2E8F0',
    fontWeight: '700',
  },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,196,0,0.35)',
    flexShrink: 0,
    minHeight: 30,
    marginTop: 3,
  },
  streakEmoji: { fontSize: 11 },
  streakText: { flex: 1, minWidth: 0 },
  streakTitle: {
    color: '#F8FAFC',
    fontSize: 7,
    fontWeight: '800',
    lineHeight: 9,
  },
  streakSub: {
    color: '#FFC400',
    fontSize: 6,
    fontWeight: '700',
    lineHeight: 8,
  },
});
