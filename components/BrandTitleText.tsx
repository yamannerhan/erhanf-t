import { useEffect } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  type AnimatedStyle,
} from 'react-native-reanimated';

const PURPLE = '#B47AFF';
const GOLD = '#FFD024';
const PURPLE_SOFT = '#9333EA';
const GOLD_SOFT = '#F59E0B';

const PURPLE_GRADIENT = ['#F5E6FF', '#C084FC', '#9333EA', '#6B21FF'] as const;
const GOLD_GRADIENT = ['#FFFBEB', '#FFE566', '#FFC400', '#F59E0B'] as const;

const isNative = Platform.OS === 'android' || Platform.OS === 'ios';

function webGradientStyle(colors: readonly string[]): TextStyle {
  return {
    backgroundImage: `linear-gradient(115deg, ${colors.join(', ')})`,
    // @ts-expect-error RN Web
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
  };
}

function brandFont(base: TextStyle): TextStyle {
  return {
    ...base,
    fontWeight: Platform.OS === 'android' ? '700' : '900',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : null),
  };
}

function NativeBrandWord({
  text,
  color,
  softColor,
  fontStyle,
  wrapStyle,
}: {
  text: string;
  color: string;
  softColor: string;
  fontStyle: TextStyle;
  wrapStyle?: AnimatedStyle<ViewStyle>;
}) {
  const styled = brandFont(fontStyle);

  return (
    <Animated.View style={[styles.wordWrap, wrapStyle]}>
      <Text style={[styled, styles.glowText, { color: softColor }]}>{text}</Text>
      <Text style={[styled, styles.mainText, { color }]}>{text}</Text>
    </Animated.View>
  );
}

function WebBrandWord({
  text,
  gradientColors,
  glowColor,
  fontStyle,
  wrapStyle,
}: {
  text: string;
  gradientColors: readonly string[];
  glowColor: string;
  fontStyle: TextStyle;
  wrapStyle?: AnimatedStyle<ViewStyle>;
}) {
  return (
    <Animated.View style={[styles.wordWrap, wrapStyle]}>
      <Text
        style={[
          fontStyle,
          webGradientStyle(gradientColors),
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

function BrandWord({
  text,
  color,
  softColor,
  gradientColors,
  glowColor,
  fontStyle,
  wrapStyle,
}: {
  text: string;
  color: string;
  softColor: string;
  gradientColors: readonly string[];
  glowColor: string;
  fontStyle: TextStyle;
  wrapStyle?: AnimatedStyle<ViewStyle>;
}) {
  if (isNative) {
    return (
      <NativeBrandWord
        text={text}
        color={color}
        softColor={softColor}
        fontStyle={fontStyle}
        wrapStyle={wrapStyle}
      />
    );
  }

  return (
    <WebBrandWord
      text={text}
      gradientColors={gradientColors}
      glowColor={glowColor}
      fontStyle={fontStyle}
      wrapStyle={wrapStyle}
    />
  );
}

function useFlowAnimation() {
  const flow = useSharedValue(0);
  const drift = useSharedValue(0);

  useEffect(() => {
    flow.value = withRepeat(
      withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    drift.value = withRepeat(
      withTiming(1, { duration: 3600, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, [flow, drift]);

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(flow.value, [0, 0.5, 1], [0.82, 1, 0.82]),
    transform: [
      { translateY: interpolate(drift.value, [0, 1], [-1.5, 1.5]) },
    ],
  }));

  const linesStyle = useAnimatedStyle(() => ({
    opacity: interpolate(flow.value, [0, 0.5, 1], [0.45, 1, 0.45]),
    transform: [{ translateX: interpolate(flow.value, [0, 1], [0, 8]) }],
  }));

  return { shimmerStyle, linesStyle };
}

function useSignatureAnimation() {
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 2800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [pulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulse.value, [0, 0.5, 1], [0.8, 1, 0.8]),
  }));

  return { pulseStyle };
}

export function BrandLogoTitle() {
  const { shimmerStyle, linesStyle } = useFlowAnimation();
  const headerFont: TextStyle = {
    fontSize: 18,
    fontStyle: 'italic',
    lineHeight: 22,
  };

  return (
    <View style={styles.logoRow}>
      <BrandWord
        text="ERHAN "
        color={PURPLE}
        softColor={PURPLE_SOFT}
        gradientColors={PURPLE_GRADIENT}
        glowColor="rgba(168,85,247,0.9)"
        fontStyle={headerFont}
        wrapStyle={shimmerStyle}
      />
      <View style={styles.fitWrap}>
        <BrandWord
          text="FIT"
          color={GOLD}
          softColor={GOLD_SOFT}
          gradientColors={GOLD_GRADIENT}
          glowColor="rgba(255,196,0,0.9)"
          fontStyle={headerFont}
          wrapStyle={shimmerStyle}
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
  const { pulseStyle } = useSignatureAnimation();
  const sigFont: TextStyle = {
    fontSize: 10,
    fontStyle: 'italic',
    lineHeight: 13,
    letterSpacing: 0.5,
  };

  return (
    <View style={styles.signatureRow}>
      <Text style={styles.signaturePrefix}>{prefix}</Text>
      <BrandWord
        text="ERHAN "
        color={PURPLE}
        softColor={PURPLE_SOFT}
        gradientColors={PURPLE_GRADIENT}
        glowColor="rgba(168,85,247,0.85)"
        fontStyle={sigFont}
        wrapStyle={pulseStyle}
      />
      <BrandWord
        text="FIT"
        color={GOLD}
        softColor={GOLD_SOFT}
        gradientColors={GOLD_GRADIENT}
        glowColor="rgba(255,196,0,0.85)"
        fontStyle={sigFont}
        wrapStyle={pulseStyle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
  },
  fitWrap: { flexDirection: 'row', alignItems: 'center' },
  wordWrap: {
    flexShrink: 0,
    position: 'relative',
  },
  glowText: {
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 0.42,
  },
  mainText: {
    position: 'relative',
  },
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
    marginTop: 4,
    flexShrink: 0,
  },
  signaturePrefix: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.4,
    lineHeight: 13,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : null),
  },
});
