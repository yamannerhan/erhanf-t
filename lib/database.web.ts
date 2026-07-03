import type {
  BodyMeasurement,
  DietMeal,
  Exercise,
  WorkoutDay,
  WorkoutSession,
} from './types';

const STORAGE_KEY = 'erhanfit_data_v1';

interface StoreData {
  workout_days: WorkoutDay[];
  exercises: Exercise[];
  diet_meals: DietMeal[];
  water_logs: { id: number; date: string; amountMl: number }[];
  body_measurements: BodyMeasurement[];
  workout_sessions: WorkoutSession[];
  app_meta: Record<string, string>;
  nextIds: Record<string, number>;
}

function defaultStore(): StoreData {
  return {
    workout_days: [],
    exercises: [],
    diet_meals: [],
    water_logs: [],
    body_measurements: [],
    workout_sessions: [],
    app_meta: {},
    nextIds: {
      workout_days: 1,
      exercises: 1,
      diet_meals: 1,
      water_logs: 1,
      body_measurements: 1,
      workout_sessions: 1,
    },
  };
}

function reloadStore(): StoreData {
  store = loadStore();
  return store;
}

function loadStore(): StoreData {
  if (typeof localStorage === 'undefined') return defaultStore();
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultStore();
  try {
    return { ...defaultStore(), ...JSON.parse(raw) };
  } catch {
    return defaultStore();
  }
}

function saveStore(data: StoreData) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}

let store = loadStore();

function nextId(table: keyof StoreData['nextIds']): number {
  const id = store.nextIds[table]++;
  saveStore(store);
  return id;
}

export async function getDatabase(): Promise<null> {
  return null;
}

export async function isSeeded(): Promise<boolean> {
  return store.app_meta.seeded === 'true';
}

export async function markSeeded() {
  store.app_meta.seeded = 'true';
  saveStore(store);
}

export async function getWorkoutDays(): Promise<WorkoutDay[]> {
  reloadStore();
  return [...store.workout_days].sort((a, b) => a.dayNumber - b.dayNumber);
}

export async function getWorkoutDay(id: number): Promise<WorkoutDay | null> {
  return store.workout_days.find((d) => d.id === id) ?? null;
}

export async function insertWorkoutDay(day: Omit<WorkoutDay, 'id'>): Promise<number> {
  const id = nextId('workout_days');
  store.workout_days.push({ ...day, id });
  saveStore(store);
  return id;
}

export async function getExercises(dayId: number): Promise<Exercise[]> {
  reloadStore();
  const nid = Number(dayId);
  return store.exercises
    .filter((e) => Number(e.dayId) === nid)
    .sort((a, b) => a.orderIndex - b.orderIndex);
}

export async function insertExercise(
  exercise: Omit<Exercise, 'id' | 'completed'>
): Promise<number> {
  const id = nextId('exercises');
  store.exercises.push({ ...exercise, id, completed: 0 });
  saveStore(store);
  return id;
}

export async function resetExerciseCompletion(dayId: number) {
  store.exercises = store.exercises.map((e) =>
    e.dayId === dayId ? { ...e, completed: 0 } : e
  );
  saveStore(store);
}

export async function setExerciseCompleted(id: number, completed: boolean) {
  const ex = store.exercises.find((e) => e.id === id);
  if (ex) ex.completed = completed ? 1 : 0;
  saveStore(store);
}

export async function deleteExercise(id: number) {
  reloadStore();
  const nid = Number(id);
  store.exercises = store.exercises.filter((e) => Number(e.id) !== nid);
  saveStore(store);
}

export async function deleteWorkoutDay(id: number) {
  reloadStore();
  const nid = Number(id);
  store.exercises = store.exercises.filter((e) => Number(e.dayId) !== nid);
  store.workout_sessions = store.workout_sessions.filter((s) => Number(s.dayId) !== nid);
  store.workout_days = store.workout_days.filter((d) => Number(d.id) !== nid);
  saveStore(store);
}

export async function getDietMeals(): Promise<DietMeal[]> {
  reloadStore();
  return [...store.diet_meals].sort((a, b) => a.orderIndex - b.orderIndex);
}

export async function clearDietMeals() {
  store.diet_meals = [];
  saveStore(store);
}

export async function insertDietMeal(
  meal: Omit<DietMeal, 'id' | 'eaten'>
): Promise<number> {
  const id = nextId('diet_meals');
  store.diet_meals.push({ ...meal, id, eaten: 0 });
  saveStore(store);
  return id;
}

export async function setMealEaten(id: number, eaten: boolean) {
  const meal = store.diet_meals.find((m) => m.id === id);
  if (meal) meal.eaten = eaten ? 1 : 0;
  saveStore(store);
}

export async function deleteDietMeal(id: number) {
  reloadStore();
  const nid = Number(id);
  store.diet_meals = store.diet_meals.filter((m) => Number(m.id) !== nid);
  saveStore(store);
}

export async function resetMealsEatenToday() {
  store.diet_meals = store.diet_meals.map((m) => ({ ...m, eaten: 0 }));
  saveStore(store);
}

export async function addWater(date: string, amountMl: number) {
  const id = nextId('water_logs');
  store.water_logs.push({ id, date, amountMl });
  saveStore(store);
}

export async function removeWater(date: string, amountMl: number) {
  const logs = store.water_logs.filter((w) => w.date === date);
  const exact = [...logs].reverse().find((w) => w.amountMl === amountMl);
  const target = exact ?? logs[logs.length - 1];
  if (!target) return;
  store.water_logs = store.water_logs.filter((w) => w.id !== target.id);
  saveStore(store);
}

export async function clearWaterForDate(date: string) {
  store.water_logs = store.water_logs.filter((w) => w.date !== date);
  saveStore(store);
}

export async function getWaterLogsForDate(
  date: string
): Promise<{ id: number; date: string; amountMl: number }[]> {
  return store.water_logs.filter((w) => w.date === date);
}

export async function getWaterForDate(date: string): Promise<number> {
  return store.water_logs
    .filter((w) => w.date === date)
    .reduce((sum, w) => sum + w.amountMl, 0);
}

export async function addBodyMeasurement(
  measurement: Omit<BodyMeasurement, 'id'>
): Promise<number> {
  const id = nextId('body_measurements');
  store.body_measurements.push({ ...measurement, id });
  saveStore(store);
  return id;
}

export async function getBodyMeasurements(limit = 90): Promise<BodyMeasurement[]> {
  return [...store.body_measurements]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-limit);
}

export async function getLatestMeasurement(): Promise<BodyMeasurement | null> {
  const sorted = [...store.body_measurements].sort((a, b) => {
    const dateCmp = b.date.localeCompare(a.date);
    if (dateCmp !== 0) return dateCmp;
    return b.id - a.id;
  });
  return sorted[0] ?? null;
}

export async function getFirstMeasurement(): Promise<BodyMeasurement | null> {
  const sorted = [...store.body_measurements].sort((a, b) => {
    const dateCmp = a.date.localeCompare(b.date);
    if (dateCmp !== 0) return dateCmp;
    return a.id - b.id;
  });
  return sorted[0] ?? null;
}

export async function startWorkoutSession(dayId: number): Promise<number> {
  const id = nextId('workout_sessions');
  store.workout_sessions.push({
    id,
    dayId,
    startedAt: new Date().toISOString(),
    endedAt: null,
    durationSec: 0,
  });
  saveStore(store);
  return id;
}

export async function endWorkoutSession(sessionId: number, durationSec: number) {
  const session = store.workout_sessions.find((s) => s.id === sessionId);
  if (session) {
    session.endedAt = new Date().toISOString();
    session.durationSec = durationSec;
    saveStore(store);
  }
}

export async function getWorkoutSessions(dayId?: number): Promise<WorkoutSession[]> {
  const sessions = dayId
    ? store.workout_sessions.filter((s) => s.dayId === dayId)
    : store.workout_sessions;
  return [...sessions].sort((a, b) => b.startedAt.localeCompare(a.startedAt));
}

export async function getAppMeta(key: string): Promise<string | null> {
  reloadStore();
  return store.app_meta[key] ?? null;
}

export async function setAppMeta(key: string, value: string): Promise<void> {
  store.app_meta[key] = value;
  saveStore(store);
}

export async function clearBodyMeasurements(): Promise<void> {
  reloadStore();
  store.body_measurements = [];
  saveStore(store);
}

export async function clearWaterLogs(): Promise<void> {
  reloadStore();
  store.water_logs = [];
  saveStore(store);
}

export async function clearWorkoutSessions(): Promise<void> {
  reloadStore();
  store.workout_sessions = [];
  saveStore(store);
}

export async function resetAllExerciseCompletion(): Promise<void> {
  reloadStore();
  store.exercises = store.exercises.map((e) => ({ ...e, completed: 0 }));
  saveStore(store);
}

export async function clearUserAppMeta(): Promise<void> {
  reloadStore();
  const seeded = store.app_meta.seeded;
  store.app_meta = seeded ? { seeded } : {};
  saveStore(store);
}

export async function getCompletedSessionCount(): Promise<number> {
  reloadStore();
  return store.workout_sessions.filter((s) => s.endedAt != null).length;
}

export async function getTotalExerciseTargetCount(): Promise<number> {
  reloadStore();
  return store.exercises.length;
}

export async function getCompletedExerciseCount(): Promise<number> {
  reloadStore();
  return store.exercises.filter((e) => e.completed === 1).length;
}

export async function getTotalWaterLiters(): Promise<number> {
  reloadStore();
  const total = store.water_logs.reduce((sum, w) => sum + w.amountMl, 0);
  return total / 1000;
}

export async function getMeasurementTrend(
  field: 'weight' | 'waist',
  days = 7
): Promise<number[]> {
  reloadStore();
  const rows = [...store.body_measurements]
    .sort((a, b) => {
      const dateCmp = b.date.localeCompare(a.date);
      return dateCmp !== 0 ? dateCmp : b.id - a.id;
    })
    .slice(0, days)
    .reverse();
  const values = rows
    .map((r) => (field === 'weight' ? r.weight : r.waist))
    .filter((v): v is number => v != null);
  return values.length > 0
    ? values
    : field === 'weight'
      ? [91, 90.5, 90.2, 91, 90.8, 90.4, 91]
      : [71, 70.8, 70.5, 70.3, 70.2, 70.1, 70];
}

export async function getMeasurementDelta(
  field: 'weight' | 'waist',
  days = 7
): Promise<number | null> {
  reloadStore();
  const rows = [...store.body_measurements]
    .sort((a, b) => {
      const dateCmp = b.date.localeCompare(a.date);
      return dateCmp !== 0 ? dateCmp : b.id - a.id;
    })
    .slice(0, days);
  if (rows.length < 2) return null;
  const latest = field === 'weight' ? rows[0].weight : rows[0].waist;
  const oldest = field === 'weight' ? rows[rows.length - 1].weight : rows[rows.length - 1].waist;
  if (latest == null || oldest == null) return null;
  return Math.round((latest - oldest) * 10) / 10;
}
