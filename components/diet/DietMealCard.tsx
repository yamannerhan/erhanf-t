import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { DietMeal } from '@/lib/types';

type MealPreset = {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  kcal: number;
  protein: number;
  carb: number;
  fat: number;
  items: readonly string[];
};

export function DietMealCard({ preset, dbMeal, compact = false }: { preset: MealPreset; dbMeal?: DietMeal; compact?: boolean }) {
  return (
    <View style={[styles.card, { borderLeftColor: preset.color }, compact && styles.cardCompact]}>
      <View style={styles.head}>
        <Ionicons name={preset.icon} size={compact ? 11 : 14} color={preset.color} />
        <View style={styles.headText}>
          <Text style={[styles.name, compact && styles.nameCompact]} numberOfLines={1}>{preset.name}</Text>
          <Text style={[styles.kcal, { color: preset.color }]}>{preset.kcal} kcal</Text>
        </View>
        <Pressable style={[styles.addBtn, { borderColor: preset.color + '44' }]} onPress={() => router.push('/diet/add-meal' as never)}>
          <Ionicons name="add" size={9} color={preset.color} />
        </Pressable>
      </View>
      {!compact && (
        <Text style={styles.macros}>P:{preset.protein} K:{preset.carb} Y:{preset.fat}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#070B12',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderLeftWidth: 3,
    padding: 6,
    minHeight: 0,
  },
  cardCompact: { padding: 5 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  headText: { flex: 1, minWidth: 0 },
  name: { color: '#F8FAFC', fontSize: 10, fontWeight: '800' },
  nameCompact: { fontSize: 8 },
  kcal: { fontSize: 7, fontWeight: '700' },
  addBtn: { padding: 4, borderRadius: 6, borderWidth: 1 },
  macros: { color: '#71717A', fontSize: 6, marginTop: 4 },
});
