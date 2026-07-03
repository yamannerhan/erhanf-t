import { useEffect } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  type AnimatedStyle,
} from 'react-native-reanimated';

const PURPLE_COLORS = ['#F5E6FF', '#C084FC', '#9333EA', '#6B21FF'] as const;
const GOLD_COLORS = ['#FFFBEB', '#FFE566', '#FFC400', '#F59E0B'] as const;

function webGradientStyle(colors: readonly string[]): TextStyle {
  return {
    backgroundImage: `linear-gradient(115deg, ${colors.join(', ')})`,
    // @ts-expect-error RN Web
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
  };
}

function GradientWord({
  text,
  colors,
  glowColor,
  fontStyle,
  shimmerStyle,
  floatStyle,
}: {
  text: string;
  colors: readonly string[];
  glowColor: string;
  fontStyle: TextStyle;
  shimmerStyle?: AnimatedStyle<ViewStyle>;
  floatStyle?: AnimatedStyle<ViewStyle>;
}) {
  const wrapStyle = floatStyle ? [shimmerStyle, floatStyle] : shimmerStyle;

  if (Platform.OS === 'web') {
    return (
      <Animated.View style={wrapStyle}>
        <Text
          style={[
            fontStyle,
            webGradientStyle(colors),
            {
              textShadowColor: glowColor,
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 12,
            },
          ]}>
          {text}
        </Text>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.wordWrap, wrapStyle]}>
      <Text
        style={[
          fontStyle,
          styles.glowLayer,
          { color: glowColor, textShadowColor: glowColor },
        ]}>
        {text}
      </Text>
      <MaskedView
        style={styles.maskWrap}
        maskElement={<Text style={[fontStyle, styles.maskText]}>{text}</Text>}>
        <View style={styles.gradientStack}>
          <LinearGradient
            colors={[...colors]}
            start={{ x: 0, y: 0.2 }}
            end={{ x: 1, y: 0.8 }}
            style={StyleSheet.absoluteFill}
          />
          <Animated.View style={[styles.shimmerBand, shimmerStyle]}>
            <LinearGradient
              colors={['transparent', 'rgba(255,255,255,0.55)', 'transparent']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.shimmerFill}
            />
          </Animated.View>
          <Text style={[fontStyle, styles.maskText, styles.sizeAnchor]}>{text}</Text>
        </View>
      </MaskedView>
    </Animated.View>
  );
}

function useFlowAnimation() {
  const flow = useSharedValue(0);
  const drift = useSharedValue(0);

  useEffect(() => {
    flow.value = withRepeat(
      withTiming(1, { duration: 2800, easing: Easing.linear }),
      -1,
      false
    );
    drift.value = withRepeat(
      withTiming(1, { duration: 4200, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, [flow, drift]);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(flow.value, [0, 1], [-48, 48]) }],
    opacity: interpolate(flow.value, [0, 0.15, 0.5, 0.85, 1], [0.2, 0.9, 1, 0.9, 0.2]),
  }));

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(drift.value, [0, 1], [-1.2, 1.2]) }],
  }));

  const linesStyle = useAnimatedStyle(() => ({
    opacity: interpolate(flow.value, [0, 0.5, 1], [0.35, 1, 0.35]),
    transform: [{ translateX: interpolate(flow.value, [0, 1], [0, 10]) }],
  }));

  return { shimmerStyle, floatStyle, linesStyle };
}

function useSignatureAnimation() {
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 3200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [pulse]);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(pulse.value, [0, 1], [-28, 28]) }],
    opacity: interpolate(pulse.value, [0, 0.5, 1], [0.35, 0.85, 0.35]),
  }));

  const floatStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulse.value, [0, 0.5, 1], [0.88, 1, 0.88]),
  }));

  return { shimmerStyle, floatStyle };
}

export function BrandLogoTitle() {
  const { shimmerStyle, floatStyle, linesStyle } = useFlowAnimation();
  const headerFont: TextStyle = {
    fontSize: 18,
    fontWeight: '900',
    fontStyle: 'italic',
    lineHeight: 22,
  };

  return (
    <View style={styles.logoRow}>
      <GradientWord
        text="ERHAN "
        colors={PURPLE_COLORS}
        glowColor="rgba(168,85,247,0.9)"
        fontStyle={headerFont}
        shimmerStyle={shimmerStyle}
        floatStyle={floatStyle}
      />
      <View style={styles.fitWrap}>
        <GradientWord
          text="FIT"
          colors={GOLD_COLORS}
          glowColor="rgba(255,196,0,0.9)"
          fontStyle={headerFont}
          shimmerStyle={shimmerStyle}
          floatStyle={floatStyle}
        />
        <Animated.View style={[styles.motionLines, linesStyle]}>
          <View style={[styles.line, styles.line1]} />
          <View style={[styles.line, styles.line2]} />
          <View style={[styles.line, styles.line3]} />
        </Animated.View>
      </View>
    </View>
  );
}

export function BrandSignatureText({ prefix = '— ' }: { prefix?: string }) {
  const { shimmerStyle, floatStyle } = useSignatureAnimation();
  const sigFont: TextStyle = {
    fontSize: 9,
    fontWeight: '800',
    fontStyle: 'italic',
    lineHeight: 12,
    letterSpacing: 0.6,
  };

  return (
    <View style={styles.signatureRow}>
      <Text style={styles.signaturePrefix}>{prefix}</Text>
      <GradientWord
        text="ERHAN "
        colors={PURPLE_COLORS}
        glowColor="rgba(168,85,247,0.85)"
        fontStyle={sigFont}
        shimmerStyle={shimmerStyle}
        floatStyle={floatStyle}
      />
      <GradientWord
        text="FIT"
        colors={GOLD_COLORS}
        glowColor="rgba(255,196,0,0.85)"
        fontStyle={sigFont}
        shimmerStyle={shimmerStyle}
        floatStyle={floatStyle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  fitWrap: { flexDirection: 'row', alignItems: 'center' },
  wordWrap: { position: 'relative' },
  maskWrap: { flexDirection: 'row' },
  gradientStack: {
    overflow: 'hidden',
    flexDirection: 'row',
  },
  shimmerBand: {
    ...StyleSheet.absoluteFillObject,
    width: '180%',
    left: '-40%',
  },
  shimmerFill: { flex: 1 },
  glowLayer: {
    position: 'absolute',
    textShadowRadius: 16,
    textShadowOffset: { width: 0, height: 0 },
    opacity: 0.5,
  },
  maskText: { backgroundColor: 'transparent' },
  sizeAnchor: { opacity: 0 },
  motionLines: { marginLeft: 3, justifyContent: 'center', gap: 2 },
  line: {
    height: 2,
    borderRadius: 1,
    backgroundColor: 'rgba(255,196,0,0.9)',
  },
  line1: { width: 14 },
  line2: { width: 10, opacity: 0.75 },
  line3: { width: 6, opacity: 0.5 },
  signatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  signaturePrefix: {
    color: '#71717A',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
});
