import { DASHBOARD } from '@/lib/dashboardDefaults';

export const WORKOUT_SCREEN = {
  subtitle: 'Gücünü Keşfet, Limitlerini Zorla!',
  streak: DASHBOARD.streak,
  totalWorkouts: DASHBOARD.workoutsDone,
  totalDuration: '18s 45d',
  weeklyGoalDone: 3,
  weeklyGoalTotal: 5,
  weeklySummary: {
    completed: 3,
    calories: '2.340',
    duration: '4s 30d',
    successRate: DASHBOARD.successRate,
  },
  recommendation: {
    text: 'Bugün dinlenme günü. Yarın 4. gün antrenmanın için enerjini topla!',
    cta: 'Planı Gör',
  },
} as const;

export const PROGRAM_META: Record<
  number,
  { exercises: number; duration: string; level: string; map: 'chest' | 'back' | 'legs' }
> = {
  1: { exercises: 8, duration: '60-75 dk', level: 'Orta Seviye', map: 'chest' },
  2: { exercises: 7, duration: '60-75 dk', level: 'Orta Seviye', map: 'back' },
  3: { exercises: 9, duration: '60-80 dk', level: 'İleri Seviye', map: 'legs' },
};

export const WORKOUT_TABS = [
  { id: 'programs', label: 'Programlar', icon: 'barbell' as const },
  { id: 'exercises', label: 'Hareketler', icon: 'fitness' as const },
  { id: 'favorites', label: 'Favorilerim', icon: 'heart' as const },
  { id: 'history', label: 'Geçmişim', icon: 'time' as const },
];
