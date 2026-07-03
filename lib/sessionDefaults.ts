import { PROGRAM_META } from '@/lib/workoutDefaults';

export const SESSION_DEFAULTS = {
  burnKcal: 520,
  duration: '45-60 dk',
  difficulty: 'Orta',
  restBetween: '60-90 sn',
  tip: 'Daha iyi sonuç için formuna odaklan ve hareketleri doğru yap!',
  warmupCta: 'Isınma Hareketleri',
  startTitle: 'ANTRENMANI BAŞLAT',
  startSub: 'Hadi Erhan, bugün kendini geçme zamanı!',
  exerciseRest: [60, 90, 60, 60, 90, 90],
  exerciseDifficulty: ['Orta', 'Orta', 'Kolay', 'Orta', 'Zor', 'Zor'],
} as const;

export function getSessionMeta(dayNumber: number) {
  return PROGRAM_META[dayNumber] ?? PROGRAM_META[3];
}
