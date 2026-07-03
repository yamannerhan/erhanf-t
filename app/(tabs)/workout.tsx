import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/components/AppProvider';
import { TabScreenShell, TabSlot } from '@/components/layout/TabScreenShell';
import { ProgramDayCard } from '@/components/workout/ProgramDayCard';
import { WorkoutHeroCard } from '@/components/workout/WorkoutHeroCard';
import { WorkoutRecommendation } from '@/components/workout/WorkoutRecommendation';
import { WorkoutWeeklySummary } from '@/components/workout/WorkoutWeeklySummary';
import { getWorkoutDays } from '@/lib/database';
import { WORKOUT_SCREEN, WORKOUT_TABS } from '@/lib/workoutDefaults';
import type { WorkoutDay } from '@/lib/types';

export default function WorkoutScreen() {
  const { ready, refreshKey } = useApp();
  const insets = useSafeAreaInsets();
  const [days, setDays] = useState<WorkoutDay[]>([]);
  const [activeTab, setActiveTab] = useState('programs');

  const load = useCallback(async () => {
    setDays(await getWorkoutDays());
  }, []);

  useEffect(() => {
    if (ready) load();
  }, [ready, refreshKey, load]);

  return (
    <TabScreenShell
      title="ANTRENMAN"
      subtitle={WORKOUT_SCREEN.subtitle}
      subtitleColor="#A855F7"
      paddingTop={insets.top + 4}
      paddingBottom={insets.bottom + 52}>
      <TabSlot flex={22}>
        <WorkoutHeroCard compact />
      </TabSlot>

      <TabSlot shrink>
        <View style={styles.tabs}>
          {WORKOUT_TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <Pressable
                key={tab.id}
                style={[styles.tab, active && styles.tabActive]}
                onPress={() => setActiveTab(tab.id)}>
                <Ionicons name={tab.icon} size={10} color={active ? '#F8FAFC' : '#71717A'} />
                <Text style={[styles.tabText, active && styles.tabTextActive]} numberOfLines={1}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </TabSlot>

      {activeTab === 'programs' ? (
        <>
          <TabSlot flex={42}>
            <View style={styles.programs}>
              {days.map((day) => (
                <View key={day.id} style={styles.programSlot}>
                  <ProgramDayCard day={day} compact />
                </View>
              ))}
            </View>
          </TabSlot>
          <TabSlot flex={16} row>
            <View style={styles.bottomHalf}>
              <WorkoutWeeklySummary compact />
            </View>
            <View style={styles.bottomHalf}>
              <WorkoutRecommendation compact />
            </View>
          </TabSlot>
        </>
      ) : (
        <TabSlot flex={58}>
          <View style={styles.placeholder}>
            <Ionicons name="construct-outline" size={22} color="#52525B" />
            <Text style={styles.placeholderText}>Bu bölüm yakında</Text>
          </View>
        </TabSlot>
      )}
    </TabScreenShell>
  );
}

const styles = StyleSheet.create({
  tabs: { flexDirection: 'row', gap: 4 },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#070B12',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  tabActive: { backgroundColor: '#7C3AED', borderColor: '#A855F7' },
  tabText: { color: '#71717A', fontSize: 7, fontWeight: '700' },
  tabTextActive: { color: '#F8FAFC' },
  programs: { flex: 1, gap: 3, minHeight: 0 },
  programSlot: { flex: 1, minHeight: 0 },
  bottomHalf: { flex: 1, minWidth: 0, minHeight: 0 },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6 },
  placeholderText: { color: '#71717A', fontSize: 10, fontWeight: '600' },
});
