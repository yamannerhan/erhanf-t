import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function buildWeek() {
  const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
  const out: { label: string; day: number; iso: string }[] = [];
  const now = new Date();
  for (let i = -3; i <= 3; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    out.push({ label: days[(d.getDay() + 6) % 7], day: d.getDate(), iso: d.toISOString().split('T')[0] });
  }
  return out;
}

export function DietDateStrip({ compact = false }: { compact?: boolean }) {
  const dates = useMemo(() => buildWeek(), []);
  const today = new Date().toISOString().split('T')[0];
  const [selected, setSelected] = useState(today);

  return (
    <View style={styles.wrap}>
      <Pressable style={styles.arrow}><Ionicons name="chevron-back" size={12} color="#71717A" /></Pressable>
      <View style={styles.strip}>
        {dates.map((d) => {
          const active = d.iso === selected;
          return (
            <Pressable key={d.iso} style={[styles.chip, active && styles.chipActive, compact && styles.chipCompact]} onPress={() => setSelected(d.iso)}>
              <Text style={[styles.chipDay, active && styles.chipDayActive]}>{d.label}</Text>
              <Text style={[styles.chipNum, active && styles.chipNumActive]}>{d.day}</Text>
            </Pressable>
          );
        })}
      </View>
      <Pressable style={styles.arrow}><Ionicons name="chevron-forward" size={12} color="#71717A" /></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  arrow: { width: 18, alignItems: 'center' },
  strip: { flex: 1, flexDirection: 'row', justifyContent: 'space-between' },
  chip: { alignItems: 'center', paddingHorizontal: 4, paddingVertical: 3, borderRadius: 8, minWidth: 26 },
  chipCompact: { paddingVertical: 2 },
  chipActive: { backgroundColor: '#7C3AED' },
  chipDay: { color: '#71717A', fontSize: 6, fontWeight: '700' },
  chipDayActive: { color: '#E9D5FF' },
  chipNum: { color: '#E2E8F0', fontSize: 9, fontWeight: '900' },
  chipNumActive: { color: '#F8FAFC' },
});
