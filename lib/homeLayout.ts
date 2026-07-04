import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

export const HOME_GAP = 10;
export const TAB_BAR_HEIGHT = 82;
export const CONTENT_BOTTOM_PAD = 92;
export const HERO_MAX_HEIGHT = 195;
export const MOTIVATION_HEIGHT = 100;
export const PAIR_MIN_HEIGHT = 130;

export function useHomeLayout() {
  const { width } = useWindowDimensions();

  return useMemo(() => {
    const ratio = Math.min(Math.max(width / 390, 0.88), 1.2);
    const s = (n: number) => Math.round(n * ratio);

    return {
      width,
      ratio,
      s,
      gap: HOME_GAP,
      padH: HOME_GAP,
      statsWide: width >= 400,
      pairMinHeight: PAIR_MIN_HEIGHT,
      heroHeight: Math.min(HERO_MAX_HEIGHT, s(168)),
    };
  }, [width]);
}
