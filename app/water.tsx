import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '@/components/AppProvider';
import { WaterTracker } from '@/components/WaterTracker';
import { theme } from '@/constants/theme';
import {
  addWater,
  clearWaterForDate,
  getWaterForDate,
  removeWater,
} from '@/lib/database';

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

export default function WaterScreen() {
  const { ready, refreshKey } = useApp();
  const [water, setWater] = useState(0);

  const load = useCallback(async () => {
    setWater(await getWaterForDate(todayStr()));
  }, []);

  useEffect(() => {
    if (ready) load();
  }, [ready, refreshKey, load]);

  const handleAdd = async (ml: number) => {
    await addWater(todayStr(), ml);
    setWater((w) => w + ml);
  };

  const handleRemove = async (ml: number) => {
    await removeWater(todayStr(), ml);
    setWater(await getWaterForDate(todayStr()));
  };

  const handleClear = async () => {
    await clearWaterForDate(todayStr());
    setWater(0);
  };

  return (
    <View style={styles.root}>
      <LinearGradient colors={[theme.background, theme.backgroundMid]} style={StyleSheet.absoluteFill} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Su Takibi</Text>
        <Text style={styles.sub}>Günlük hedefini tut, hidrasyonunu koru</Text>
        <WaterTracker
          totalMl={water}
          onAdd={handleAdd}
          onRemove={handleRemove}
          onClear={handleClear}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.background },
  content: { padding: 20, paddingBottom: 40 },
  title: { color: theme.text, fontSize: 26, fontWeight: '900', marginBottom: 6 },
  sub: { color: theme.textMuted, fontSize: 14, marginBottom: 20 },
});
