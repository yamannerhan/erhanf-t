import {
  addBodyMeasurement,
  addWater,
  clearBodyMeasurements,
  clearUserAppMeta,
  clearWaterLogs,
  clearWorkoutSessions,
  getExercises,
  getWorkoutDays,
  resetAllExerciseCompletion,
  setExerciseCompleted,
  startWorkoutSession,
  endWorkoutSession,
} from './database';
import { setFitnessStartDate, setStreakDays, setAppMeta } from './appMeta';
import { DASHBOARD, WAIST_TREND, WEIGHT_TREND } from './dashboardDefaults';

export const DEMO_DASHBOARD_VERSION = 'v3';
export { DASHBOARD as DEMO } from './dashboardDefaults';

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

function dateOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export async function clearUserProgressData(): Promise<void> {
  await clearBodyMeasurements();
  await clearWaterLogs();
  await clearWorkoutSessions();
  await resetAllExerciseCompletion();
  await clearUserAppMeta();
}

export async function applyDashboardDemoData(): Promise<void> {
  await clearUserProgressData();

  const trendDates = [
    '2026-06-27',
    '2026-06-28',
    '2026-06-29',
    '2026-06-30',
    '2026-07-01',
    '2026-07-02',
    '2026-07-03',
  ];

  for (let i = 0; i < trendDates.length; i++) {
    await addBodyMeasurement({
      date: trendDates[i],
      weight: WEIGHT_TREND[i],
      waist: WAIST_TREND[i],
      shoulder: 50,
      arm: 35,
      leg: 55,
      chest: 60,
    });
  }

  const today = todayStr();
  await addWater(today, DASHBOARD.waterTodayMl);

  const remainingMl = Math.round(DASHBOARD.waterTotal * 1000 - DASHBOARD.waterTodayMl);
  if (remainingMl > 0) {
    const parts = 8;
    const perPart = Math.floor(remainingMl / parts);
    for (let i = 1; i <= parts; i++) {
      await addWater(dateOffset(-i * 3), perPart);
    }
  }

  const days = await getWorkoutDays();
  let completed = 0;
  const target = 12;
  for (const day of days) {
    const exercises = await getExercises(day.id);
    for (const ex of exercises) {
      if (completed >= target) break;
      await setExerciseCompleted(ex.id, true);
      completed++;
    }
    if (completed >= target) break;
  }

  for (let i = 0; i < 8; i++) {
    if (!days[i % days.length]) continue;
    const sessionId = await startWorkoutSession(days[i % days.length].id);
    await endWorkoutSession(sessionId, 3600);
  }

  await setFitnessStartDate(DASHBOARD.startDateIso);
  await setStreakDays(DASHBOARD.streak);
  await setAppMeta('program_day', String(DASHBOARD.programDay));
  await setAppMeta(`daily_calories_${today}`, '2340');
  await setAppMeta(`plan_done_${today}`, JSON.stringify(['warmup']));
  await setAppMeta('total_calories_burned', String(DASHBOARD.caloriesBurned));
  await setAppMeta('demo_dashboard_version', DEMO_DASHBOARD_VERSION);
}

export async function ensureDashboardDemoData(): Promise<void> {
  const { getAppMeta } = await import('./database');
  const version = await getAppMeta('demo_dashboard_version');
  if (version === DEMO_DASHBOARD_VERSION) return;
  await applyDashboardDemoData();
}
