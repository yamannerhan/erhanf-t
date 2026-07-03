import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

const NOTIFICATIONS = [
  { id: '1', title: 'Antrenman Hatırlatıcısı', body: 'Bugünkü antrenmanını yapmayı unutma!', icon: 'barbell', color: theme.purple, time: '2 saat önce' },
  { id: '2', title: 'Su Hedefi', body: 'Günlük su hedefinin %72\'sine ulaştın.', icon: 'water', color: theme.blue, time: '4 saat önce' },
  { id: '3', title: 'Yaz Kampanyası', body: 'Premium üyeliklerde %20 indirim!', icon: 'megaphone', color: theme.gold, time: '1 gün önce' },
];

export default function NotificationsScreen() {
  return (
    <View style={styles.root}>
      <LinearGradient colors={[theme.background, theme.backgroundMid]} style={StyleSheet.absoluteFill} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Bildirimler</Text>
        {NOTIFICATIONS.map((n) => (
          <View key={n.id} style={styles.card}>
            <View style={[styles.iconWrap, { backgroundColor: `${n.color}22` }]}>
              <Ionicons name={n.icon as never} size={22} color={n.color} />
            </View>
            <View style={styles.textWrap}>
              <Text style={styles.cardTitle}>{n.title}</Text>
              <Text style={styles.cardBody}>{n.body}</Text>
              <Text style={styles.time}>{n.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.background },
  content: { padding: 20, paddingBottom: 40 },
  title: { color: theme.text, fontSize: 26, fontWeight: '900', marginBottom: 20 },
  card: {
    flexDirection: 'row',
    backgroundColor: 'rgba(16,20,38,0.8)',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(138,43,255,0.2)',
    gap: 12,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: { flex: 1 },
  cardTitle: { color: theme.text, fontSize: 14, fontWeight: '800' },
  cardBody: { color: theme.textMuted, fontSize: 12, marginTop: 4, lineHeight: 18 },
  time: { color: theme.textMuted, fontSize: 10, marginTop: 6 },
});
