import { useEffect } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { AppLogo } from '@/components/AppLogo';
import { theme } from '@/constants/theme';
import type { BroadcastData } from '@/lib/githubContent';

interface BroadcastOverlayProps {
  broadcast: BroadcastData | null;
  onDismiss: () => void;
}

export function BroadcastOverlay({ broadcast, onDismiss }: BroadcastOverlayProps) {
  const backdrop = useSharedValue(0);
  const cardY = useSharedValue(80);
  const cardScale = useSharedValue(0.85);
  const logoScale = useSharedValue(0.3);
  const logoRotate = useSharedValue(-12);
  const ringScale = useSharedValue(0.6);
  const ringOpacity = useSharedValue(0);
  const badgePulse = useSharedValue(1);

  useEffect(() => {
    if (!broadcast) return;

    backdrop.value = withTiming(1, { duration: 350 });
    cardY.value = withSpring(0, { damping: 16, stiffness: 140 });
    cardScale.value = withSpring(1, { damping: 14, stiffness: 120 });
    logoScale.value = withSequence(
      withTiming(1.15, { duration: 280, easing: Easing.out(Easing.back(1.8)) }),
      withSpring(1, { damping: 10, stiffness: 160 })
    );
    logoRotate.value = withSequence(
      withTiming(8, { duration: 220 }),
      withSpring(0, { damping: 12, stiffness: 100 })
    );
    ringOpacity.value = withDelay(100, withTiming(1, { duration: 300 }));
    ringScale.value = withRepeat(
      withSequence(
        withTiming(1.35, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    badgePulse.value = withRepeat(
      withSequence(withTiming(1.06, { duration: 600 }), withTiming(1, { duration: 600 })),
      -1,
      true
    );
  }, [backdrop, badgePulse, broadcast, cardScale, cardY, logoRotate, logoScale, ringOpacity, ringScale]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdrop.value,
  }));

  const cardStyle = useAnimatedStyle(() => ({
    opacity: backdrop.value,
    transform: [{ translateY: cardY.value }, { scale: cardScale.value }],
  }));

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }, { rotate: `${logoRotate.value}deg` }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    opacity: ringOpacity.value * 0.5,
    transform: [{ scale: ringScale.value }],
  }));

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgePulse.value }],
  }));

  if (!broadcast) return null;

  return (
    <Modal transparent visible animationType="none" onRequestClose={onDismiss}>
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Animated.View style={[styles.card, cardStyle]}>
          <LinearGradient
            colors={['#0A0A0F', '#1A1A2E', '#0F172A']}
            style={styles.gradient}>
            <View style={styles.logoArea}>
              <Animated.View style={[styles.ring, ringStyle]} />
              <Animated.View style={logoStyle}>
                <AppLogo size={96} borderRadius={18} />
              </Animated.View>
            </View>

            <Text style={styles.brand}>ERHAN FIT</Text>
            <Animated.View style={[styles.badge, badgeStyle]}>
              <Ionicons name="notifications" size={14} color={theme.warning} />
              <Text style={styles.badgeText}>YENİ BİLDİRİM</Text>
            </Animated.View>

            <Text style={styles.title}>{broadcast.title}</Text>
            <Text style={styles.message}>{broadcast.message}</Text>

            <Pressable style={styles.btn} onPress={onDismiss}>
              <Text style={styles.btnText}>Tamam</Text>
            </Pressable>
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.success + '55',
  },
  gradient: {
    padding: 28,
    alignItems: 'center',
  },
  logoArea: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  ring: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: theme.success,
  },
  brand: {
    color: theme.text,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    backgroundColor: theme.warning + '22',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: theme.warning,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  title: {
    color: theme.text,
    fontSize: 20,
    fontWeight: '800',
    marginTop: 18,
    textAlign: 'center',
  },
  message: {
    color: theme.textMuted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
    textAlign: 'center',
  },
  btn: {
    marginTop: 24,
    backgroundColor: theme.success,
    paddingHorizontal: 36,
    paddingVertical: 14,
    borderRadius: 14,
  },
  btnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
});
