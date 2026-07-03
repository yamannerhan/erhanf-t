import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/components/AppProvider';
import { DietBottomCards } from '@/components/diet/DietBottomCards';
import { DietCalorieCard } from '@/components/diet/DietCalorieCard';
import { DietDateStrip } from '@/components/diet/DietDateStrip';
import { DietMealCard } from '@/components/diet/DietMealCard';
import { DietTipBanner } from '@/components/diet/DietTipBanner';
import { DietWaterStrip } from '@/components/diet/DietWaterStrip';
import { TabScreenShell, TabSlot } from '@/components/layout/TabScreenShell';
import { getDietMeals } from '@/lib/database';
import { DIET_MEALS, DIET_SCREEN } from '@/lib/dietDefaults';
import type { DietMeal } from '@/lib/types';

export default function DietScreen() {
  const { ready, refreshKey } = useApp();
  const insets = useSafeAreaInsets();
  const [meals, setMeals] = useState<DietMeal[]>([]);

  const load = useCallback(async () => {
    setMeals(await getDietMeals());
  }, []);

  useEffect(() => {
    if (ready) load();
  }, [ready, refreshKey, load]);

  const findMeal = (name: string) =>
    meals.find((m) => m.name.toLowerCase().includes(name.toLowerCase().split(' ')[0]));

  return (
    <TabScreenShell
      title="DİYET"
      subtitle={DIET_SCREEN.subtitle}
      paddingTop={insets.top + 4}
      paddingBottom={insets.bottom + 52}>
      <TabSlot flex={20}>
        <DietCalorieCard compact />
      </TabSlot>
      <TabSlot shrink>
        <DietDateStrip compact />
      </TabSlot>
      <TabSlot flex={36}>
        <Text style={styles.sectionTitle}>ÖĞÜNLERİM</Text>
        <View style={styles.mealGrid}>
          {DIET_MEALS.map((preset) => (
            <View key={preset.id} style={styles.mealSlot}>
              <DietMealCard preset={preset} dbMeal={findMeal(preset.name)} compact />
            </View>
          ))}
        </View>
      </TabSlot>
      <TabSlot flex={12}>
        <DietWaterStrip compact />
      </TabSlot>
      <TabSlot flex={14}>
        <DietBottomCards compact />
      </TabSlot>
      <TabSlot flex={10}>
        <DietTipBanner compact />
      </TabSlot>
    </TabScreenShell>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    color: '#9CA3AF',
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 3,
    flexShrink: 0,
  },
  mealGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    minHeight: 0,
  },
  mealSlot: {
    width: '48.5%',
    flexGrow: 1,
    minHeight: 0,
    height: '48%',
  },
});
