import { DASHBOARD } from '@/lib/dashboardDefaults';

export const DIET_SCREEN = {
  subtitle: 'Beslenmeni kontrol et, hedeflerine daha hızlı ulaş!',
  calorieGoal: 2800,
  calorieCurrent: 2340,
  protein: { current: 120, goal: 160, color: '#22C55E' },
  carb: { current: 180, goal: 250, color: '#FFC400' },
  fat: { current: 65, goal: 80, color: '#A855F7' },
  remainingCalories: 460,
  waterCurrent: 1.8,
  waterGoal: 2.5,
  waterPct: DASHBOARD.waterPct,
  nutritionScore: 87,
  weeklyAvg: 2125,
  weightCurrent: 91,
  weightTarget: 78,
  goalLabel: 'Yağ Kaybı',
  tip: 'Düzenli ve dengeli beslenme, antrenmandan %30 daha fazla sonuç almanı sağlar.',
} as const;

export const DIET_MEALS = [
  {
    id: 'breakfast',
    name: 'Kahvaltı',
    icon: 'sunny-outline' as const,
    color: '#22C55E',
    kcal: 520,
    protein: 35,
    carb: 55,
    fat: 18,
    items: ['Yulaf Ezmesi', 'Whey Protein', 'Muz', 'Badem'],
  },
  {
    id: 'lunch',
    name: 'Öğle Yemeği',
    icon: 'sunny' as const,
    color: '#FFC400',
    kcal: 720,
    protein: 55,
    carb: 70,
    fat: 22,
    items: ['Tavuk Göğsü', 'Pirinç', 'Brokoli', 'Zeytinyağı'],
  },
  {
    id: 'dinner',
    name: 'Akşam Yemeği',
    icon: 'partly-sunny-outline' as const,
    color: '#A855F7',
    kcal: 680,
    protein: 48,
    carb: 45,
    fat: 20,
    items: ['Somon', 'Salata', 'Avokado', 'Tam Buğday Ekmek'],
  },
  {
    id: 'snack',
    name: 'Ara Öğün',
    icon: 'moon-outline' as const,
    color: '#60A5FA',
    kcal: 420,
    protein: 30,
    carb: 35,
    fat: 12,
    items: ['Yoğurt', 'Yulaf', 'Meyve'],
  },
] as const;

export const WEEKLY_CALORIES = [1980, 2150, 2340, 2100, 2250, 2050, 2340];
