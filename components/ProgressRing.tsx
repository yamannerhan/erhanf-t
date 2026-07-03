import { Platform, View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { theme } from '@/constants/theme';

interface ProgressRingProps {
  size: number;
  stroke?: number;
  progress: number;
  color?: string;
  children?: React.ReactNode;
}

export function ProgressRing({
  size,
  stroke = 7,
  progress,
  color = theme.purple,
  children,
}: ProgressRingProps) {
  const radius = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const clamped = Math.min(Math.max(progress, 0), 1);
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped);

  if (Platform.OS === 'web') {
    const deg = clamped * 360;
    return (
      <View
        style={{
          width: size,
          height: size,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: stroke,
            borderColor: 'rgba(255,255,255,0.08)',
          }}
        />
        <View
          style={{
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: stroke,
            borderColor: 'transparent',
            borderTopColor: color,
            borderRightColor: deg > 90 ? color : 'transparent',
            borderBottomColor: deg > 180 ? color : 'transparent',
            borderLeftColor: deg > 270 ? color : 'transparent',
            transform: [{ rotate: '-90deg' }],
          }}
        />
        {children}
      </View>
    );
  }

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      </Svg>
      {children}
    </View>
  );
}
