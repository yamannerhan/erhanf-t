import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/constants/theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  borderColor?: string;
  onPress?: () => void;
  glow?: 'purple' | 'gold' | 'green' | 'blue' | 'pink' | 'none';
}

const glowColors: Record<string, string> = {
  purple: theme.glow.purple,
  gold: theme.glow.gold,
  green: theme.glow.green,
  blue: theme.glow.blue,
  pink: 'rgba(255, 77, 109, 0.35)',
  none: 'transparent',
};

export function GlassCard({
  children,
  style,
  borderColor = theme.cardBorder,
  onPress,
  glow = 'purple',
}: GlassCardProps) {
  const inner = (
    <LinearGradient
      colors={['rgba(16,20,38,0.85)', 'rgba(8,11,20,0.92)']}
      style={[
        styles.card,
        { borderColor, shadowColor: glowColors[glow] },
        style,
      ]}>
      {children}
    </LinearGradient>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [pressed && styles.pressed]}>
        {inner}
      </Pressable>
    );
  }
  return inner;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radius.md,
    borderWidth: 1,
    padding: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },
});
