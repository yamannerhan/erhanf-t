import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ProgressRing } from '@/components/ProgressRing';
import {
  daysBetween,
  formatTurkishDate,
  getFitnessStartDate,
  setFitnessStartDate,
} from '@/lib/appMeta';
import { theme } from '@/constants/theme';

const TOTAL_DAYS = 90;

export default function StartDateScreen() {
  const [startDate, setStartDate] = useState('');
  const [inputDate, setInputDate] = useState('');
  const [dayCount, setDayCount] = useState(1);

  useEffect(() => {
    getFitnessStartDate().then((date) => {
      setStartDate(date);
      setInputDate(date);
      setDayCount(daysBetween(date));
    });
  }, []);

  const save = async () => {
    if (!inputDate.match(/^\d{4}-\d{2}-\d{2}$/)) return;
    await setFitnessStartDate(inputDate);
    setStartDate(inputDate);
    setDayCount(daysBetween(inputDate));
  };

  const progress = Math.min(dayCount / TOTAL_DAYS, 1);
  const size = 140;

  return (
    <View style={styles.root}>
      <LinearGradient colors={[theme.background, theme.backgroundMid]} style={StyleSheet.absoluteFill} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Spora Başlama</Text>
        <Text style={styles.date}>{startDate ? formatTurkishDate(startDate) : '—'}</Text>

        <ProgressRing size={size} stroke={10} progress={progress}>
          <View style={styles.ringCenter}>
            <Text style={styles.ringNum}>{dayCount}</Text>
            <Text style={styles.ringLabel}>GÜN</Text>
          </View>
        </ProgressRing>

        <Text style={styles.progress}>
          Toplam Süre {dayCount} / {TOTAL_DAYS} Gün
        </Text>

        <Text style={styles.label}>Başlangıç Tarihi (YYYY-MM-DD)</Text>
        <TextInput
          style={styles.input}
          value={inputDate}
          onChangeText={setInputDate}
          placeholder="2026-07-03"
          placeholderTextColor={theme.textMuted}
        />
        <Pressable style={styles.saveBtn} onPress={save}>
          <Text style={styles.saveText}>Kaydet</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.background },
  content: { padding: 20, alignItems: 'center', paddingBottom: 40 },
  title: { color: theme.textMuted, fontSize: 12, fontWeight: '800', letterSpacing: 2 },
  date: { color: theme.text, fontSize: 20, fontWeight: '900', marginTop: 8, marginBottom: 24 },
  ringCenter: { alignItems: 'center' },
  ringNum: { color: theme.text, fontSize: 42, fontWeight: '900' },
  ringLabel: { color: theme.textMuted, fontSize: 14, fontWeight: '800' },
  progress: { color: theme.textMuted, fontSize: 14, marginBottom: 32 },
  label: { color: theme.textMuted, fontSize: 12, alignSelf: 'flex-start', marginBottom: 6 },
  input: {
    width: '100%',
    backgroundColor: 'rgba(16,20,38,0.8)',
    borderRadius: 12,
    padding: 14,
    color: theme.text,
    borderWidth: 1,
    borderColor: 'rgba(138,43,255,0.3)',
    fontSize: 16,
    marginBottom: 16,
  },
  saveBtn: {
    width: '100%',
    backgroundColor: theme.purple,
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  saveText: { color: '#fff', fontWeight: '900', fontSize: 16 },
});
