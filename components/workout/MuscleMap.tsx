import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

type MuscleZone = 'chest' | 'back' | 'legs';

interface MuscleMapProps {
  zone: MuscleZone;
  color: string;
  width?: number;
  height?: number;
}

export function MuscleMap({ zone, color, width = 54, height = 78 }: MuscleMapProps) {
  const dim = color + '55';
  const bright = color + 'CC';

  return (
    <View style={[styles.wrap, { width, height }]}>
      <Svg width={width} height={height} viewBox="0 0 54 78">
        <Circle cx="27" cy="10" r="7" fill="#1E293B" stroke="#334155" strokeWidth="1" />
        <Path
          d="M14 20 C14 20 10 24 10 34 L10 42 C10 46 12 48 16 48 L38 48 C42 48 44 46 44 42 L44 34 C44 24 40 20 40 20 Z"
          fill="#1E293B"
          stroke="#334155"
          strokeWidth="1"
        />
        <Ellipse cx="10" cy="30" rx="4" ry="12" fill="#1E293B" stroke="#334155" strokeWidth="1" />
        <Ellipse cx="44" cy="30" rx="4" ry="12" fill="#1E293B" stroke="#334155" strokeWidth="1" />
        <Path
          d="M18 48 L16 76 L24 76 L26 52 Z M36 48 L38 76 L30 76 L28 52 Z"
          fill="#1E293B"
          stroke="#334155"
          strokeWidth="1"
        />

        {zone === 'chest' && (
          <>
            <Ellipse cx="27" cy="30" rx="11" ry="8" fill={bright} />
            <Ellipse cx="10" cy="34" rx="3" ry="8" fill={dim} />
            <Ellipse cx="44" cy="34" rx="3" ry="8" fill={dim} />
          </>
        )}
        {zone === 'back' && (
          <>
            <Path d="M18 22 L27 20 L36 22 L34 42 L20 42 Z" fill={bright} />
            <Ellipse cx="10" cy="32" rx="3" ry="9" fill={bright} />
            <Ellipse cx="44" cy="32" rx="3" ry="9" fill={bright} />
          </>
        )}
        {zone === 'legs' && (
          <>
            <Ellipse cx="27" cy="22" rx="9" ry="5" fill={bright} />
            <Path d="M16 48 L14 76 L24 76 L26 54 Z" fill={bright} />
            <Path d="M38 48 L36 54 L30 76 L38 76 Z" fill={bright} />
          </>
        )}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
