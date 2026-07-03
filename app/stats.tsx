import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ProgressCard } from '@/components/home/ProgressCard';
import { BodyChart } from '@/components/BodyChart';
import { theme } from '@/constants/theme';
import {
  getBodyMeasurements,
  getCompletedSessionCount,
  getTotalWaterLiters,
} from '@/lib/database';
import type { BodyMeasurement } from '@/lib/types';

export default function StatsScreen() {
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([]);
  const [sessions, setSessions] = useState(0);
  const [water, setWater] = useState(0);

  useEffect(() => {
    (async () => {
      const [m, s, w] = await Promise.all([
        getBodyMeasurements(),
        getCompletedSessionCount(),
        getTotalWaterLiters(),
      ]);
      setMeasurements(m);
      setSessions(s);
      setWater(w);
    })();
  }, []);

  return (
    <View style={styles.root}>
      <LinearGradient colors={[theme.background, theme.backgroundMid]} style={StyleSheet.absoluteFill} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>İstatistikler</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryVal}>{sessions}</Text>
            <Text style={styles.summaryLabel}>Antrenman</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={[styles.summaryVal, { color: theme.blue }]}>{water} L</Text>
            <Text style={styles.summaryLabel}>Toplam Su</Text>
          </View>
        </View>
        <ProgressCard />
        <Text style={styles.section}>Gelişim Grafikleri</Text>
        <BodyChart measurements={measurements} period="month" />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.background },
  content: { padding: 20, paddingBottom: 40 },
  title: { color: theme.text, fontSize: 26, fontWeight: '900', marginBottom: 16 },
  summaryRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  summaryCard: {
    flex: 1,
    backgroundColor: 'rgba(16,20,38,0.8)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(138,43,255,0.25)',
  },
  summaryVal: { color: theme.purple, fontSize: 28, fontWeight: '900' },
  summaryLabel: { color: theme.textMuted, fontSize: 12, marginTop: 4 },
  section: { color: theme.text, fontSize: 18, fontWeight: '800', marginTop: 8, marginBottom: 12 },
});
