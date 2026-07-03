import { getAppMeta, setAppMeta } from './database';

export { getAppMeta, setAppMeta };

export async function getFitnessStartDate(): Promise<string> {
  const stored = await getAppMeta('fitness_start_date');
  if (stored) return stored;
  const today = new Date().toISOString().split('T')[0];
  await setAppMeta('fitness_start_date', today);
  return today;
}

export async function setFitnessStartDate(date: string): Promise<void> {
  await setAppMeta('fitness_start_date', date);
}

export function daysBetween(startDate: string, endDateInput = new Date()): number {
  const start = new Date(startDate + 'T12:00:00');
  const endDay =
    endDateInput instanceof Date
      ? endDateInput.toISOString().split('T')[0]
      : endDateInput;
  const end = new Date(endDay + 'T12:00:00');
  const diff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(1, diff + 1);
}

export async function getStreakDays(): Promise<number> {
  const stored = await getAppMeta('streak_days');
  if (stored) return Math.max(1, parseInt(stored, 10) || 1);
  await setAppMeta('streak_days', '1');
  return 1;
}

export async function setStreakDays(days: number): Promise<void> {
  await setAppMeta('streak_days', String(Math.max(1, days)));
}

export async function getProgramDay(): Promise<number> {
  const override = await getAppMeta('program_day');
  if (override) return Math.max(1, parseInt(override, 10) || 1);
  return daysBetween(await getFitnessStartDate());
}

export async function setProgramDay(day: number): Promise<void> {
  await setAppMeta('program_day', String(Math.max(1, day)));
}

export async function getTotalCaloriesBurned(): Promise<number> {
  const raw = await getAppMeta('total_calories_burned');
  return raw ? parseInt(raw, 10) || 0 : 0;
}

export async function getPlanDone(date: string): Promise<string[]> {
  const raw = await getAppMeta(`plan_done_${date}`);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export async function togglePlanItem(date: string, itemId: string): Promise<string[]> {
  const current = await getPlanDone(date);
  const next = current.includes(itemId)
    ? current.filter((id) => id !== itemId)
    : [...current, itemId];
  await setAppMeta(`plan_done_${date}`, JSON.stringify(next));
  return next;
}

export async function getDailyCalories(date: string): Promise<number> {
  const raw = await getAppMeta(`daily_calories_${date}`);
  return raw ? parseInt(raw, 10) || 0 : 0;
}

export async function addDailyCalories(date: string, kcal: number): Promise<void> {
  const current = await getDailyCalories(date);
  await setAppMeta(`daily_calories_${date}`, String(current + kcal));
}

export function formatTurkishDate(dateStr: string): string {
  const months = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
  ];
  const d = new Date(dateStr + 'T12:00:00');
  return `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
}
