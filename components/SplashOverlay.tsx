import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { AppLogo } from '@/components/AppLogo';
import { theme } from '@/constants/theme';

interface SplashOverlayProps {
  visible: boolean;
  message?: string;
}

export function SplashOverlay({ visible, message }: SplashOverlayProps) {
  const opacity = useSharedValue(0);
  const logoScale = useSharedValue(0.5);
  const logoY = useSharedValue(30);
  const textOpacity = useSharedValue(0);
  const ringScale = useSharedValue(0.8);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 400 });
      logoScale.value = withSequence(
        withTiming(1.12, { duration: 700, easing: Easing.out(Easing.back(1.6)) }),
        withTiming(1, { duration: 250 })
      );
      logoY.value = withTiming(0, { duration: 700, easing: Easing.out(Easing.cubic) });
      textOpacity.value = withDelay(400, withTiming(1, { duration: 500 }));
      ringScale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 1100 }),
          withTiming(0.95, { duration: 1100 })
        ),
        -1,
        true
      );
    } else {
      opacity.value = withTiming(0, { duration: 400 });
    }
  }, [visible, logoScale, logoY, opacity, ringScale, textOpacity]);

  const containerStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }, { translateY: logoY.value }],
  }));
  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: 0.35,
  }));
  const textStyle = useAnimatedStyle(() => ({ opacity: textOpacity.value }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <LinearGradient
        colors={['#0A0A0F', '#1A1A2E', '#0A0A0F']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.logoArea}>
        <Animated.View style={[styles.ring, ringStyle]} />
        <Animated.View style={logoStyle}>
          <AppLogo size={104} borderRadius={20} />
        </Animated.View>
      </View>
      <Animated.View style={textStyle}>
        <Text style={styles.brand}>ERHAN</Text>
        <Text style={styles.brandFit}>FIT</Text>
        <Text style={styles.tagline}>Disiplin • Beslenme • Antrenman</Text>
      </Animated.View>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    backgroundColor: theme.background,
  },
  logoArea: {
    width: 130,
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  ring: {
    position: 'absolute',
    width: 118,
    height: 118,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: theme.success,
  },
  brand: {
    fontSize: 48,
    fontWeight: '900',
    color: theme.text,
    letterSpacing: 8,
    textAlign: 'center',
  },
  brandFit: {
    fontSize: 56,
    fontWeight: '900',
    color: theme.success,
    letterSpacing: 12,
    textAlign: 'center',
    marginTop: -8,
  },
  tagline: {
    fontSize: 12,
    color: theme.textMuted,
    textAlign: 'center',
    marginTop: 16,
    letterSpacing: 2,
  },
  message: {
    position: 'absolute',
    bottom: 80,
    color: theme.textMuted,
    fontSize: 14,
  },
});
