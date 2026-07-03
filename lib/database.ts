import * as SQLite from 'expo-sqlite';
import type {
  BodyMeasurement,
  DietMeal,
  Exercise,
  WaterLog,
  WorkoutDay,
  WorkoutSession,
} from './types';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync('erhanfit.db');
    await initDatabase(db);
  }
  return db;
}

async function initDatabase(database: SQLite.SQLiteDatabase) {
  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS workout_days (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      dayNumber INTEGER NOT NULL,
      title TEXT NOT NULL,
      muscleGroups TEXT NOT NULL,
      imageUri TEXT NOT NULL,
      accentColor TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      dayId INTEGER NOT NULL,
      orderIndex INTEGER NOT NULL,
      cropUri TEXT NOT NULL,
      name TEXT NOT NULL,
      sets INTEGER DEFAULT 3,
      reps INTEGER DEFAULT 12,
      completed INTEGER DEFAULT 0,
      FOREIGN KEY (dayId) REFERENCES workout_days(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS diet_meals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      orderIndex INTEGER NOT NULL,
      name TEXT NOT NULL,
      timeStart TEXT NOT NULL,
      timeEnd TEXT NOT NULL,
      cropUri TEXT NOT NULL,
      ingredients TEXT DEFAULT '',
      eaten INTEGER DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS water_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      amountMl INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS body_measurements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      weight REAL,
      waist REAL,
      shoulder REAL,
      arm REAL,
      leg REAL,
      chest REAL
    );
    CREATE TABLE IF NOT EXISTS workout_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      dayId INTEGER NOT NULL,
      startedAt TEXT NOT NULL,
      endedAt TEXT,
      durationSec INTEGER DEFAULT 0,
      FOREIGN KEY (dayId) REFERENCES workout_days(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS app_meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
}

export async function isSeeded(): Promise<boolean> {
  const database = await getDatabase();
  const row = await database.getFirstAsync<{ value: string }>(
    'SELECT value FROM app_meta WHERE key = ?',
    ['seeded']
  );
  return row?.value === 'true';
}

export async function markSeeded() {
  const database = await getDatabase();
  await database.runAsync(
    'INSERT OR REPLACE INTO app_meta (key, value) VALUES (?, ?)',
    ['seeded', 'true']
  );
}

export async function getWorkoutDays(): Promise<WorkoutDay[]> {
  const database = await getDatabase();
  return database.getAllAsync<WorkoutDay>(
    'SELECT * FROM workout_days ORDER BY dayNumber ASC'
  );
}

export async function getWorkoutDay(id: number): Promise<WorkoutDay | null> {
  const database = await getDatabase();
  return database.getFirstAsync<WorkoutDay>('SELECT * FROM workout_days WHERE id = ?', [id]);
}

export async function insertWorkoutDay(
  day: Omit<WorkoutDay, 'id'>
): Promise<number> {
  const database = await getDatabase();
  const result = await database.runAsync(
    'INSERT INTO workout_days (dayNumber, title, muscleGroups, imageUri, accentColor) VALUES (?, ?, ?, ?, ?)',
    [day.dayNumber, day.title, day.muscleGroups, day.imageUri, day.accentColor]
  );
  return result.lastInsertRowId;
}

export async function getExercises(dayId: number): Promise<Exercise[]> {
  const database = await getDatabase();
  return database.getAllAsync<Exercise>(
    'SELECT * FROM exercises WHERE dayId = ? ORDER BY orderIndex ASC',
    [dayId]
  );
}

export async function insertExercise(
  exercise: Omit<Exercise, 'id' | 'completed'>
): Promise<number> {
  const database = await getDatabase();
  const result = await database.runAsync(
    'INSERT INTO exercises (dayId, orderIndex, cropUri, name, sets, reps) VALUES (?, ?, ?, ?, ?, ?)',
    [
      exercise.dayId,
      exercise.orderIndex,
      exercise.cropUri,
      exercise.name,
      exercise.sets,
      exercise.reps,
    ]
  );
  return result.lastInsertRowId;
}

export async function resetExerciseCompletion(dayId: number) {
  const database = await getDatabase();
  await database.runAsync('UPDATE exercises SET completed = 0 WHERE dayId = ?', [dayId]);
}

export async function setExerciseCompleted(id: number, completed: boolean) {
  const database = await getDatabase();
  await database.runAsync('UPDATE exercises SET completed = ? WHERE id = ?', [
    completed ? 1 : 0,
    id,
  ]);
}

export async function deleteExercise(id: number) {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM exercises WHERE id = ?', [Number(id)]);
}

export async function deleteWorkoutDay(id: number) {
  const database = await getDatabase();
  const nid = Number(id);
  await database.runAsync('DELETE FROM exercises WHERE dayId = ?', [nid]);
  await database.runAsync('DELETE FROM workout_sessions WHERE dayId = ?', [nid]);
  await database.runAsync('DELETE FROM workout_days WHERE id = ?', [nid]);
}

export async function getDietMeals(): Promise<DietMeal[]> {
  const database = await getDatabase();
  return database.getAllAsync<DietMeal>(
    'SELECT * FROM diet_meals ORDER BY orderIndex ASC'
  );
}

export async function clearDietMeals() {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM diet_meals');
}

export async function insertDietMeal(
  meal: Omit<DietMeal, 'id' | 'eaten'>
): Promise<number> {
  const database = await getDatabase();
  const result = await database.runAsync(
    'INSERT INTO diet_meals (orderIndex, name, timeStart, timeEnd, cropUri, ingredients) VALUES (?, ?, ?, ?, ?, ?)',
    [meal.orderIndex, meal.name, meal.timeStart, meal.timeEnd, meal.cropUri, meal.ingredients]
  );
  return result.lastInsertRowId;
}

export async function setMealEaten(id: number, eaten: boolean) {
  const database = await getDatabase();
  await database.runAsync('UPDATE diet_meals SET eaten = ? WHERE id = ?', [eaten ? 1 : 0, id]);
}

export async function deleteDietMeal(id: number) {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM diet_meals WHERE id = ?', [Number(id)]);
}

export async function resetMealsEatenToday() {
  const database = await getDatabase();
  await database.runAsync('UPDATE diet_meals SET eaten = 0');
}

export async function addWater(date: string, amountMl: number) {
  const database = await getDatabase();
  await database.runAsync('INSERT INTO water_logs (date, amountMl) VALUES (?, ?)', [
    date,
    amountMl,
  ]);
}

export async function removeWater(date: string, amountMl: number) {
  const database = await getDatabase();
  const row = await database.getFirstAsync<{ id: number }>(
    `SELECT id FROM water_logs WHERE date = ? AND amountMl = ? ORDER BY id DESC LIMIT 1`,
    [date, amountMl]
  );
  if (row?.id) {
    await database.runAsync('DELETE FROM water_logs WHERE id = ?', [row.id]);
    return;
  }
  const last = await database.getFirstAsync<{ id: number; amountMl: number }>(
    `SELECT id, amountMl FROM water_logs WHERE date = ? ORDER BY id DESC LIMIT 1`,
    [date]
  );
  if (last?.id) {
    await database.runAsync('DELETE FROM water_logs WHERE id = ?', [last.id]);
  }
}

export async function clearWaterForDate(date: string) {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM water_logs WHERE date = ?', [date]);
}

export async function getWaterLogsForDate(
  date: string
): Promise<{ id: number; date: string; amountMl: number }[]> {
  const database = await getDatabase();
  return database.getAllAsync<{ id: number; date: string; amountMl: number }>(
    'SELECT id, date, amountMl FROM water_logs WHERE date = ? ORDER BY id ASC',
    [date]
  );
}

export async function getWaterForDate(date: string): Promise<number> {
  const database = await getDatabase();
  const row = await database.getFirstAsync<{ total: number }>(
    'SELECT COALESCE(SUM(amountMl), 0) as total FROM water_logs WHERE date = ?',
    [date]
  );
  return row?.total ?? 0;
}

export async function addBodyMeasurement(
  measurement: Omit<BodyMeasurement, 'id'>
): Promise<number> {
  const database = await getDatabase();
  const result = await database.runAsync(
    `INSERT INTO body_measurements (date, weight, waist, shoulder, arm, leg, chest)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      measurement.date,
      measurement.weight,
      measurement.waist,
      measurement.shoulder,
      measurement.arm,
      measurement.leg,
      measurement.chest,
    ]
  );
  return result.lastInsertRowId;
}

export async function getBodyMeasurements(limit = 90): Promise<BodyMeasurement[]> {
  const database = await getDatabase();
  return database.getAllAsync<BodyMeasurement>(
    'SELECT * FROM body_measurements ORDER BY date ASC LIMIT ?',
    [limit]
  );
}

export async function getLatestMeasurement(): Promise<BodyMeasurement | null> {
  const database = await getDatabase();
  return database.getFirstAsync<BodyMeasurement>(
    'SELECT * FROM body_measurements ORDER BY date DESC, id DESC LIMIT 1'
  );
}

export async function getFirstMeasurement(): Promise<BodyMeasurement | null> {
  const database = await getDatabase();
  return database.getFirstAsync<BodyMeasurement>(
    'SELECT * FROM body_measurements ORDER BY date ASC, id ASC LIMIT 1'
  );
}

export async function startWorkoutSession(dayId: number): Promise<number> {
  const database = await getDatabase();
  const result = await database.runAsync(
    'INSERT INTO workout_sessions (dayId, startedAt) VALUES (?, ?)',
    [dayId, new Date().toISOString()]
  );
  return result.lastInsertRowId;
}

export async function endWorkoutSession(sessionId: number, durationSec: number) {
  const database = await getDatabase();
  await database.runAsync(
    'UPDATE workout_sessions SET endedAt = ?, durationSec = ? WHERE id = ?',
    [new Date().toISOString(), durationSec, sessionId]
  );
}

export async function getWorkoutSessions(dayId?: number): Promise<WorkoutSession[]> {
  const database = await getDatabase();
  if (dayId) {
    return database.getAllAsync<WorkoutSession>(
      'SELECT * FROM workout_sessions WHERE dayId = ? ORDER BY startedAt DESC',
      [dayId]
    );
  }
  return database.getAllAsync<WorkoutSession>(
    'SELECT * FROM workout_sessions ORDER BY startedAt DESC'
  );
}

export async function getCompletedSessionCount(): Promise<number> {
  const database = await getDatabase();
  const row = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM workout_sessions WHERE endedAt IS NOT NULL'
  );
  return row?.count ?? 0;
}

export async function getTotalExerciseTargetCount(): Promise<number> {
  const database = await getDatabase();
  const row = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM exercises'
  );
  return row?.count ?? 0;
}

export async function getCompletedExerciseCount(): Promise<number> {
  const database = await getDatabase();
  const row = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM exercises WHERE completed = 1'
  );
  return row?.count ?? 0;
}

export async function getTotalWaterLiters(): Promise<number> {
  const database = await getDatabase();
  const row = await database.getFirstAsync<{ total: number }>(
    'SELECT COALESCE(SUM(amountMl), 0) as total FROM water_logs'
  );
  return (row?.total ?? 0) / 1000;
}

export async function getMeasurementTrend(
  field: 'weight' | 'waist',
  days = 7
): Promise<number[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<BodyMeasurement>(
    `SELECT * FROM body_measurements ORDER BY date DESC, id DESC LIMIT ?`,
    [days]
  );
  const values = rows
    .reverse()
    .map((r) => (field === 'weight' ? r.weight : r.waist))
    .filter((v): v is number => v != null);
  return values.length > 0 ? values : field === 'weight' ? [91, 90.5, 90.2, 91, 90.8, 90.4, 91] : [71, 70.8, 70.5, 70.3, 70.2, 70.1, 70];
}

export async function getMeasurementDelta(
  field: 'weight' | 'waist',
  days = 7
): Promise<number | null> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<BodyMeasurement>(
    `SELECT * FROM body_measurements ORDER BY date DESC, id DESC LIMIT ?`,
    [days]
  );
  if (rows.length < 2) return null;
  const latest = field === 'weight' ? rows[0].weight : rows[0].waist;
  const oldest = field === 'weight' ? rows[rows.length - 1].weight : rows[rows.length - 1].waist;
  if (latest == null || oldest == null) return null;
  return Math.round((latest - oldest) * 10) / 10;
}

export async function getAppMeta(key: string): Promise<string | null> {
  const database = await getDatabase();
  const row = await database.getFirstAsync<{ value: string }>(
    'SELECT value FROM app_meta WHERE key = ?',
    [key]
  );
  return row?.value ?? null;
}

export async function setAppMeta(key: string, value: string): Promise<void> {
  const database = await getDatabase();
  await database.runAsync('INSERT OR REPLACE INTO app_meta (key, value) VALUES (?, ?)', [
    key,
    value,
  ]);
}

export async function clearBodyMeasurements(): Promise<void> {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM body_measurements');
}

export async function clearWaterLogs(): Promise<void> {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM water_logs');
}

export async function clearWorkoutSessions(): Promise<void> {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM workout_sessions');
}

export async function resetAllExerciseCompletion(): Promise<void> {
  const database = await getDatabase();
  await database.runAsync('UPDATE exercises SET completed = 0');
}

export async function clearUserAppMeta(): Promise<void> {
  const database = await getDatabase();
  await database.runAsync(`DELETE FROM app_meta WHERE key NOT IN ('seeded')`);
}
