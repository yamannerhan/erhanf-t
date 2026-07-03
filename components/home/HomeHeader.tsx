import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/components/AuthProvider';
import { BrandLogoTitle } from '@/components/BrandTitleText';
import { DASHBOARD } from '@/lib/dashboardDefaults';
import { theme } from '@/constants/theme';

export function HomeHeader() {
  const { session } = useAuth();

  return (
    <View style={styles.wrap}>
      <View style={styles.left}>
        <LinearGradient
          colors={['#22C55E', '#FFC400', '#8A2BFF', '#2F80FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.avatarRing}>
          <View style={styles.avatarInner}>
            <Text style={styles.emoji}>😄</Text>
          </View>
        </LinearGradient>

        <View style={styles.brand}>
          <BrandLogoTitle />
          <View style={styles.userRow}>
            <Text style={styles.username}>{session?.username ?? DASHBOARD.username}</Text>
            <LinearGradient colors={['#8A2BFF', '#6B21FF']} style={styles.proBadge}>
              <Text style={styles.proText}>PRO</Text>
            </LinearGradient>
          </View>
        </View>
      </View>

      <View style={styles.right}>
        <Pressable
          style={styles.streakCard}
          onPress={() => router.push('/achievements' as never)}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <Text style={styles.streakNum}>{DASHBOARD.streak}</Text>
          <Text style={styles.streakSub}>Gün Serisi</Text>
        </Pressable>
        <Pressable
          style={styles.iconBtn}
          onPress={() => router.push('/notifications' as never)}>
          <Ionicons name="notifications-outline" size={18} color={theme.text} />
          <View style={styles.notifDot} />
        </Pressable>
        <Pressable style={styles.iconBtn} onPress={() => router.push('/settings')}>
          <Ionicons name="settings-outline" size={18} color={theme.text} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  left: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 10, minWidth: 0 },
  avatarRing: {
    width: 42,
    height: 42,
    borderRadius: 21,
    padding: 2.5,
    shadowColor: '#22C55E',
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarInner: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 22 },
  brand: { flex: 1, minWidth: 0 },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  username: { color: theme.textMuted, fontSize: 11, fontWeight: '600' },
  proBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 5 },
  proText: { color: '#fff', fontSize: 8, fontWeight: '800' },
  right: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  streakCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,196,0,0.35)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  streakEmoji: { fontSize: 11 },
  streakNum: { color: theme.text, fontSize: 13, fontWeight: '900', lineHeight: 15 },
  streakSub: { color: theme.textMuted, fontSize: 7, fontWeight: '600' },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: theme.purple,
    borderWidth: 1,
    borderColor: '#0a0a0a',
  },
});
