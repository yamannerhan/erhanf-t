import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { fetchGithubAnnouncements } from '@/lib/githubAnnouncements';
import { theme } from '@/constants/theme';

export default function AnnouncementScreen() {
  const [items, setItems] = useState<string[]>([]);

  const load = useCallback(async () => {
    setItems(await fetchGithubAnnouncements(true));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <View style={styles.root}>
      <LinearGradient colors={[theme.background, theme.backgroundMid]} style={StyleSheet.absoluteFill} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Ionicons name="megaphone" size={32} color={theme.purple} />
          <Text style={styles.title}>Duyurular</Text>
        </View>
        {items.map((item, i) => (
          <View key={i} style={styles.card}>
            <Text style={styles.cardText}>{item}</Text>
          </View>
        ))}
        {items.length === 0 && (
          <Text style={styles.empty}>Henüz duyuru yok.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.background },
  content: { padding: 20, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 24 },
  title: { color: theme.text, fontSize: 24, fontWeight: '900', marginTop: 12 },
  card: {
    backgroundColor: 'rgba(16,20,38,0.8)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(138,43,255,0.3)',
  },
  cardText: { color: theme.text, fontSize: 15, lineHeight: 22 },
  empty: { color: theme.textMuted, textAlign: 'center', marginTop: 40 },
});
