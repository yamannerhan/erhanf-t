import { useCallback, useEffect, useState } from 'react';
import {
  Image,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/components/AppProvider';
import { UpdateBanner } from '@/components/UpdateBanner';
import { theme } from '@/constants/theme';
import { confirmAction } from '@/lib/confirm';
import {
  deleteDietMeal,
  deleteExercise,
  deleteWorkoutDay,
  getDietMeals,
  getExercises,
  getWorkoutDays,
} from '@/lib/database';
import { scheduleAllReminders } from '@/lib/notifications';
import type { DietMeal, Exercise, WorkoutDay } from '@/lib/types';

export default function SettingsScreen() {
  const { ready, refreshKey, refresh } = useApp();
  const [days, setDays] = useState<WorkoutDay[]>([]);
  const [exercisesByDay, setExercisesByDay] = useState<Record<number, Exercise[]>>({});
  const [meals, setMeals] = useState<DietMeal[]>([]);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  const load = useCallback(async () => {
    const d = await getWorkoutDays();
    const exMap: Record<number, Exercise[]> = {};
    for (const day of d) {
      exMap[day.id] = await getExercises(day.id);
    }
    setDays(d);
    setExercisesByDay(exMap);
    setMeals(await getDietMeals());
  }, []);

  useEffect(() => {
    if (ready) load();
  }, [ready, refreshKey, load]);

  useFocusEffect(
    useCallback(() => {
      if (ready) load();
    }, [ready, load])
  );

  const runDelete = async (action: () => Promise<void>, onSuccess?: () => void) => {
    try {
      await action();
      refresh();
      await load();
      onSuccess?.();
    } catch (e) {
      console.error('Silme hatası:', e);
    }
  };

  const handleDeleteExercise = (exercise: Exercise, dayTitle: string) => {
    confirmAction(
      'Hareketi Sil',
      `"${exercise.name}" (${dayTitle}) silinsin mi?`,
      () =>
        runDelete(async () => {
          await deleteExercise(exercise.id);
          setExercisesByDay((prev) => {
            const next = { ...prev };
            for (const dayId of Object.keys(next)) {
              next[Number(dayId)] = next[Number(dayId)].filter(
                (e) => Number(e.id) !== Number(exercise.id)
              );
            }
            return next;
          });
        })
    );
  };

  const handleDeleteDay = (day: WorkoutDay) => {
    confirmAction(
      'Günü Sil',
      `"${day.title}" ve tüm hareketleri silinsin mi?`,
      () =>
        runDelete(async () => {
          await deleteWorkoutDay(day.id);
          setExpandedDay(null);
          setDays((prev) => prev.filter((d) => Number(d.id) !== Number(day.id)));
          setExercisesByDay((prev) => {
            const next = { ...prev };
            delete next[day.id];
            return next;
          });
        })
    );
  };

  const handleDeleteMeal = (meal: DietMeal) => {
    confirmAction(
      'Öğünü Sil',
      `"${meal.name}" silinsin mi?`,
      () =>
        runDelete(async () => {
          await deleteDietMeal(meal.id);
          setMeals((prev) => prev.filter((m) => Number(m.id) !== Number(meal.id)));
        })
    );
  };

  const handleEnableNotifs = async () => {
    const ok = await scheduleAllReminders();
    const title = ok ? 'Hatırlatmalar Açık' : 'Bildirim İzni Gerekli';
    const message = ok
      ? 'Öğün ve su hatırlatmaları ayarlandı.'
      : 'Telefonda bildirim izni vermeniz gerekiyor.';
    if (Platform.OS === 'web') {
      globalThis.alert?.(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <UpdateBanner autoCheck />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ANTRENMAN</Text>

        <Pressable style={styles.actionRow} onPress={() => router.push('/workout/upload')}>
          <Ionicons name="add-circle" size={22} color={theme.success} />
          <Text style={styles.actionText}>Yeni Gün Ekle</Text>
          <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
        </Pressable>

        {days.map((day) => {
          const exercises = exercisesByDay[day.id] ?? [];
          const isOpen = expandedDay === day.id;
          return (
            <View key={day.id} style={styles.dayBlock}>
              <Pressable
                style={styles.dayHeader}
                onPress={() => setExpandedDay(isOpen ? null : day.id)}>
                <View style={[styles.dayDot, { backgroundColor: day.accentColor }]} />
                <View style={styles.dayHeaderText}>
                  <Text style={[styles.dayTitle, { color: day.accentColor }]}>{day.title}</Text>
                  <Text style={styles.daySub}>{day.muscleGroups} · {exercises.length} hareket</Text>
                </View>
                <Ionicons
                  name={isOpen ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={theme.textMuted}
                />
              </Pressable>

              {isOpen && (
                <View style={styles.dayBody}>
                  {exercises.map((ex) => (
                    <View key={ex.id} style={styles.itemRow}>
                      <Image source={{ uri: ex.cropUri }} style={styles.thumb} />
                      <View style={styles.itemInfo}>
                        <Text style={styles.itemName}>{ex.name}</Text>
                        <Text style={styles.itemMeta}>{ex.sets} x {ex.reps}</Text>
                      </View>
                      <Pressable
                        onPress={() => handleDeleteExercise(ex, day.title)}
                        hitSlop={8}>
                        <Ionicons name="trash-outline" size={20} color={theme.danger} />
                      </Pressable>
                    </View>
                  ))}

                  <Pressable
                    style={styles.inlineAdd}
                    onPress={() =>
                      router.push({
                        pathname: '/workout/add-exercise',
                        params: { dayId: String(day.id) },
                      })
                    }>
                    <Ionicons name="add" size={18} color={theme.success} />
                    <Text style={styles.inlineAddText}>Resim Ekle</Text>
                  </Pressable>

                  <Pressable
                    style={styles.inlineDelete}
                    onPress={() => handleDeleteDay(day)}>
                    <Ionicons name="trash" size={18} color={theme.danger} />
                    <Text style={styles.inlineDeleteText}>Günü Sil</Text>
                  </Pressable>
                </View>
              )}
            </View>
          );
        })}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DİYET</Text>

        <Pressable style={styles.actionRow} onPress={() => router.push('/diet/upload')}>
          <Ionicons name="cloud-upload" size={22} color={theme.warning} />
          <Text style={styles.actionText}>Diyet Resmi Yükle (Toplu)</Text>
          <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
        </Pressable>

        <Pressable style={styles.actionRow} onPress={() => router.push('/diet/add-meal')}>
          <Ionicons name="add-circle" size={22} color={theme.success} />
          <Text style={styles.actionText}>Öğün Ekle (Tek Tek)</Text>
          <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
        </Pressable>

        {meals.map((meal) => (
          <View key={meal.id} style={styles.itemRow}>
            <Image source={{ uri: meal.cropUri }} style={styles.thumb} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{meal.name}</Text>
              <Text style={styles.itemMeta}>
                {meal.timeStart} - {meal.timeEnd}
              </Text>
            </View>
            <Pressable onPress={() => handleDeleteMeal(meal)} hitSlop={8}>
              <Ionicons name="trash-outline" size={20} color={theme.danger} />
            </Pressable>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>GENEL</Text>
        <Pressable style={styles.actionRow} onPress={handleEnableNotifs}>
          <Ionicons name="notifications" size={22} color={theme.primary} />
          <Text style={styles.actionText}>Hatırlatmaları Aç</Text>
          <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  content: { padding: 20, paddingBottom: 40 },
  section: { marginBottom: 28 },
  sectionTitle: {
    color: theme.textMuted,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: theme.card,
    padding: 16,
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.cardBorder,
  },
  actionText: { flex: 1, color: theme.text, fontWeight: '700', fontSize: 15 },
  dayBlock: {
    backgroundColor: theme.card,
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.cardBorder,
    overflow: 'hidden',
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 10,
  },
  dayDot: { width: 4, height: 36, borderRadius: 2 },
  dayHeaderText: { flex: 1 },
  dayTitle: { fontSize: 16, fontWeight: '800' },
  daySub: { color: theme.textMuted, fontSize: 12, marginTop: 2 },
  dayBody: { paddingHorizontal: 14, paddingBottom: 14, gap: 8 },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: theme.background,
    padding: 10,
    borderRadius: 10,
  },
  thumb: { width: 48, height: 48, borderRadius: 8 },
  itemInfo: { flex: 1 },
  itemName: { color: theme.text, fontWeight: '700', fontSize: 14 },
  itemMeta: { color: theme.textMuted, fontSize: 12, marginTop: 2 },
  inlineAdd: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.success,
    borderStyle: 'dashed',
  },
  inlineAddText: { color: theme.success, fontWeight: '700' },
  inlineDelete: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.danger + '55',
  },
  inlineDeleteText: { color: theme.danger, fontWeight: '700' },
});
