import { useEffect, useId } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  LinearGradient,
  Path,
  RadialGradient,
  Stop,
} from 'react-native-svg';
import type { BodyShape } from '@/lib/bodyAvatar';

const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);

export type BodyAvatarVariant = 'initial' | 'current';

interface BodyAvatarProps {
  shape: BodyShape;
  variant?: BodyAvatarVariant;
  width?: number;
  height?: number;
}

export function BodyAvatar({
  shape,
  variant = 'initial',
  width = 72,
  height = 118,
}: BodyAvatarProps) {
  const uid = useId().replace(/:/g, '');
  const pulse = useSharedValue(1);
  const isCurrent = variant === 'current';

  useEffect(() => {
    if (!isCurrent) {
      pulse.value = 1;
      return;
    }
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [isCurrent, pulse]);

  const glowProps = useAnimatedProps(() => ({
    opacity: isCurrent ? 0.28 + (pulse.value - 1) * 4 : 0,
    rx: 42 * shape.chest * pulse.value,
  }));

  const cx = 60;
  const shoulderW = 38 * shape.shoulder;
  const chestW = 34 * shape.chest;
  const waistW = 26 * shape.waist;
  const hipW = 30 * shape.waist;
  const armW = 11.5 * shape.arm;
  const legW = 15.5 * shape.leg;
  const scaleY = shape.scale;

  const bodyFill = isCurrent ? `url(#${uid}-body)` : `url(#${uid}-body)`;
  const limbFill = isCurrent ? `url(#${uid}-limb)` : `url(#${uid}-limb)`;
  const headFill = isCurrent ? `url(#${uid}-head)` : `url(#${uid}-head)`;
  const highlightFill = isCurrent ? `url(#${uid}-hi)` : `url(#${uid}-hi)`;

  const torso = `
    M ${cx - shoulderW} ${46 * scaleY}
    C ${cx - shoulderW - 4} ${58 * scaleY} ${cx - chestW - 2} ${68 * scaleY} ${cx - chestW} ${84 * scaleY}
    C ${cx - waistW - 4} ${100 * scaleY} ${cx - hipW - 1} ${114 * scaleY} ${cx - hipW} ${128 * scaleY}
    L ${cx + hipW} ${128 * scaleY}
    C ${cx + hipW + 1} ${114 * scaleY} ${cx + waistW + 4} ${100 * scaleY} ${cx + chestW} ${84 * scaleY}
    C ${cx + chestW + 2} ${68 * scaleY} ${cx + shoulderW + 4} ${58 * scaleY} ${cx + shoulderW} ${46 * scaleY}
    Z
  `;

  const pecL = `
    M ${cx - chestW * 0.85} ${58 * scaleY}
    Q ${cx - chestW * 0.35} ${72 * scaleY} ${cx - 2} ${76 * scaleY}
    Q ${cx - chestW * 0.55} ${68 * scaleY} ${cx - chestW * 0.85} ${58 * scaleY}
    Z
  `;
  const pecR = `
    M ${cx + chestW * 0.85} ${58 * scaleY}
    Q ${cx + chestW * 0.35} ${72 * scaleY} ${cx + 2} ${76 * scaleY}
    Q ${cx + chestW * 0.55} ${68 * scaleY} ${cx + chestW * 0.85} ${58 * scaleY}
    Z
  `;

  const abs1 = `M ${cx - 5} ${86 * scaleY} L ${cx + 5} ${86 * scaleY}`;
  const abs2 = `M ${cx - 4} ${94 * scaleY} L ${cx + 4} ${94 * scaleY}`;
  const abs3 = `M ${cx - 3} ${102 * scaleY} L ${cx + 3} ${102 * scaleY}`;

  return (
    <View
      style={[
        styles.wrap,
        { width, height },
        isCurrent && styles.wrapGlow,
        Platform.OS === 'web' && isCurrent && ({ filter: 'drop-shadow(0 0 18px rgba(168,85,247,0.75))' } as object),
      ]}>
      <Svg width={width} height={height} viewBox="0 0 120 200">
        <Defs>
          {isCurrent ? (
            <>
              <LinearGradient id={`${uid}-body`} x1="0.2" y1="0" x2="0.8" y2="1">
                <Stop offset="0" stopColor="#C084FC" />
                <Stop offset="0.45" stopColor="#A855F7" />
                <Stop offset="1" stopColor="#7C3AED" />
              </LinearGradient>
              <LinearGradient id={`${uid}-limb`} x1="0.2" y1="0" x2="0.8" y2="1">
                <Stop offset="0" stopColor="#C084FC" />
                <Stop offset="1" stopColor="#7C3AED" />
              </LinearGradient>
              <LinearGradient id={`${uid}-head`} x1="0.3" y1="0" x2="0.7" y2="1">
                <Stop offset="0" stopColor="#E9D5FF" />
                <Stop offset="1" stopColor="#A855F7" />
              </LinearGradient>
              <RadialGradient id={`${uid}-hi`} cx="0.38" cy="0.14" r="0.65">
                <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.5" />
                <Stop offset="1" stopColor="#C084FC" stopOpacity="0" />
              </RadialGradient>
            </>
          ) : (
            <>
              <LinearGradient id={`${uid}-body`} x1="0.2" y1="0" x2="0.8" y2="1">
                <Stop offset="0" stopColor="#D1D5DB" />
                <Stop offset="0.4" stopColor="#AEB6C2" />
                <Stop offset="1" stopColor="#6B7280" />
              </LinearGradient>
              <LinearGradient id={`${uid}-limb`} x1="0.2" y1="0" x2="0.8" y2="1">
                <Stop offset="0" stopColor="#C4CBD4" />
                <Stop offset="1" stopColor="#8B95A3" />
              </LinearGradient>
              <LinearGradient id={`${uid}-head`} x1="0.3" y1="0" x2="0.7" y2="1">
                <Stop offset="0" stopColor="#E5E7EB" />
                <Stop offset="1" stopColor="#AEB6C2" />
              </LinearGradient>
              <RadialGradient id={`${uid}-hi`} cx="0.35" cy="0.12" r="0.6">
                <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.55" />
                <Stop offset="1" stopColor="#AEB6C2" stopOpacity="0" />
              </RadialGradient>
            </>
          )}
        </Defs>

        {isCurrent && (
          <>
            <Ellipse cx={cx} cy={98 * scaleY} rx={52} ry={74 * scaleY} fill="#A855F7" opacity={0.1} />
            <AnimatedEllipse
              animatedProps={glowProps}
              cx={cx}
              cy={92 * scaleY}
              ry={70 * scaleY}
              fill="#A855F7"
            />
          </>
        )}

        {!isCurrent && (
          <Ellipse cx={cx} cy={108 * scaleY} rx={38} ry={54 * scaleY} fill="#000" opacity={0.12} />
        )}

        <Ellipse
          cx={cx - waistW - legW / 2}
          cy={162 * scaleY}
          rx={legW / 2}
          ry={31 * scaleY}
          fill={limbFill}
        />
        <Ellipse
          cx={cx + waistW + legW / 2}
          cy={162 * scaleY}
          rx={legW / 2}
          ry={31 * scaleY}
          fill={limbFill}
        />
        <Ellipse
          cx={cx - shoulderW - armW / 2 - 2}
          cy={76 * scaleY}
          rx={armW / 2}
          ry={29 * scaleY}
          fill={limbFill}
        />
        <Ellipse
          cx={cx + shoulderW + armW / 2 + 2}
          cy={76 * scaleY}
          rx={armW / 2}
          ry={29 * scaleY}
          fill={limbFill}
        />

        <Path d={torso} fill={bodyFill} />
        <Path d={pecL} fill={highlightFill} opacity={isCurrent ? 0.35 : 0.25} />
        <Path d={pecR} fill={highlightFill} opacity={isCurrent ? 0.35 : 0.25} />
        <Path d={abs1} stroke={isCurrent ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'} strokeWidth={1} />
        <Path d={abs2} stroke={isCurrent ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.12)'} strokeWidth={1} />
        <Path d={abs3} stroke={isCurrent ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'} strokeWidth={1} />

        <Circle cx={cx} cy={22 * scaleY} r={18.5} fill={headFill} />
        <Circle
          cx={cx - 5}
          cy={18 * scaleY}
          r={4.5}
          fill="#FFFFFF"
          opacity={isCurrent ? 0.35 : 0.22}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapGlow: {
    shadowColor: '#A855F7',
    shadowOpacity: 0.75,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
    elevation: 16,
  },
});
