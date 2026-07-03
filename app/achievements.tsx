import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getStreakDays } from '@/lib/appMeta';
import { getCompletedSessionCount } from '@/lib/database';
import { theme } from '@/constants/theme';

const BADGES = [
  { id: 'streak', title: 'Seri Ustası', icon: 'flame', color: theme.gold, min: 7 },
  { id: 'workout5', title: '5 Antrenman', icon: 'barbell', color: theme.purple, min: 5 },
  { id: 'workout10', title: '10 Antrenman', icon: 'trophy', color: theme.green, min: 10 },
  { id: 'water', title: 'Su Kahramanı', icon: 'water', color: theme.blue, min: 1 },
  { id: 'pro', title: 'PRO Üye', icon: 'star', color: theme.pink, min: 0 },
];

export default function AchievementsScreen() {
  const [streak, setStreak] = useState(1);
  const [sessions, setSessions] = useState(0);

  useEffect(() => {
    (async () => {
      const [s, sess] = await Promise.all([getStreakDays(), getCompletedSessionCount()]);
      setStreak(s);
      setSessions(sess);
    })();
  }, []);

  const isUnlocked = (badge: (typeof BADGES)[0]) => {
    if (badge.id === 'streak') return streak >= badge.min;
    if (badge.id === 'pro') return true;
    if (badge.id.startsWith('workout')) return sessions >= badge.min;
    return sessions >= 1;
  };

  return (
    <View style={styles.root}>
      <LinearGradient colors={[theme.background, theme.backgroundMid]} style={StyleSheet.absoluteFill} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Başarılar</Text>
        <Text style={styles.sub}>🔥 {streak} günlük serin devam ediyor!</Text>
        <View style={styles.grid}>
          {BADGES.map((b) => {
            const unlocked = isUnlocked(b);
            return (
              <View
                key={b.id}
                style={[styles.badge, !unlocked && styles.badgeLocked, { borderColor: `${b.color}55` }]}>
                <Ionicons name={b.icon as never} size={32} color={unlocked ? b.color : theme.textMuted} />
                <Text style={[styles.badgeTitle, !unlocked && styles.lockedText]}>{b.title}</Text>
                {unlocked && <Text style={styles.unlocked}>Kazanıldı ✓</Text>}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.background },
  content: { padding: 20, paddingBottom: 40 },
  title: { color: theme.text, fontSize: 26, fontWeight: '900' },
  sub: { color: theme.gold, fontSize: 14, fontWeight: '700', marginTop: 6, marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  badge: {
    width: '47%',
    backgroundColor: 'rgba(16,20,38,0.8)',
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  badgeLocked: { opacity: 0.45 },
  badgeTitle: { color: theme.text, fontSize: 13, fontWeight: '800', marginTop: 8, textAlign: 'center' },
  lockedText: { color: theme.textMuted },
  unlocked: { color: theme.green, fontSize: 10, fontWeight: '700', marginTop: 4 },
});
