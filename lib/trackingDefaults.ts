import { DASHBOARD } from '@/lib/dashboardDefaults';

export const TRACKING_SCREEN = {
  subtitle: 'İlerlemeni takip et, hedeflerine ulaş!',
  successRate: DASHBOARD.successRate,
  workoutsWeek: 3,
  caloriesWeek: '2.340',
  activities: [
    { id: '1', icon: 'barbell' as const, color: '#A855F7', title: 'Omuz + Bacak', time: 'Dün, 19:30', tag: '520 kcal', tagColor: '#FF8C00' },
    { id: '2', icon: 'water' as const, color: '#60A5FA', title: 'Su Eklendi', time: 'Bugün, 10:15', tag: '+500 ml', tagColor: '#60A5FA' },
    { id: '3', icon: 'restaurant' as const, color: '#22C55E', title: 'Öğle Yemeği', time: 'Bugün, 13:45', tag: '720 kcal', tagColor: '#FFC400' },
  ],
  suggestions: [
    { id: '1', icon: 'flash' as const, color: '#A855F7', title: 'Protein Alımını Artır', desc: 'Kas gelişimi için günlük protein hedefini tamamla.' },
    { id: '2', icon: 'moon' as const, color: '#60A5FA', title: 'Uyku Düzenine Dikkat', desc: '7-8 saat uyku toparlanmayı hızlandırır.' },
    { id: '3', icon: 'walk' as const, color: '#22C55E', title: 'Günlük Adım Hedefi', desc: '10.000 adım yağ yakımını destekler.' },
  ],
} as const;

export const MEASURE_FIELDS = [
  { key: 'weight', label: 'Kilo', unit: 'kg', icon: 'scale-outline' as const },
  { key: 'waist', label: 'Bel', unit: 'cm', icon: 'resize-outline' as const },
  { key: 'shoulder', label: 'Omuz', unit: 'cm', icon: 'body-outline' as const },
  { key: 'arm', label: 'Kol', unit: 'cm', icon: 'fitness-outline' as const },
  { key: 'leg', label: 'Bacak', unit: 'cm', icon: 'walk-outline' as const },
  { key: 'chest', label: 'Göğüs', unit: 'cm', icon: 'heart-outline' as const },
] as const;
