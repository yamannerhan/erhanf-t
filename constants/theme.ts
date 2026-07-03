export const theme = {
  background: '#0a0a0a',
  backgroundMid: '#080B14',
  backgroundLight: '#101426',
  card: 'rgba(16, 20, 38, 0.72)',
  cardSolid: '#101426',
  cardBorder: 'rgba(138, 43, 255, 0.25)',
  text: '#F8FAFC',
  textMuted: '#9CA3AF',
  purple: '#8A2BFF',
  gold: '#FFC400',
  green: '#22C55E',
  blue: '#2F80FF',
  pink: '#FF4D6D',
  primary: '#8A2BFF',
  success: '#22C55E',
  warning: '#FFC400',
  danger: '#FF4D6D',
  dayColors: ['#8A2BFF', '#22C55E', '#FFC400', '#2F80FF', '#FF4D6D'],
  waterGoalMl: 2500,
  radius: {
    sm: 14,
    md: 20,
    lg: 24,
    xl: 28,
  },
  glow: {
    purple: 'rgba(138, 43, 255, 0.45)',
    gold: 'rgba(255, 196, 0, 0.4)',
    green: 'rgba(34, 197, 94, 0.4)',
    blue: 'rgba(47, 128, 255, 0.4)',
  },
};

export type DayAccent = (typeof theme.dayColors)[number];

export const glassCard = {
  backgroundColor: theme.card,
  borderRadius: theme.radius.md,
  borderWidth: 1,
  borderColor: theme.cardBorder,
  overflow: 'hidden' as const,
};
