import { useCallback, useEffect, useState } from 'react';
import { LayoutChangeEvent, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

const PART1 = 'Yaz kampanyamız başladı! • ';
const PART2 = 'Tüm premium üyeliklerde %20 indirim seni bekliyor!';
const SEGMENT_GAP = '     •     ';

function MarqueeSegment({ onLayout }: { onLayout?: (e: LayoutChangeEvent) => void }) {
  return (
    <View style={styles.segment} onLayout={onLayout}>
      <Text style={styles.marqueeText} numberOfLines={1}>
        {PART1}
      </Text>
      <Text style={[styles.marqueeText, styles.highlight]} numberOfLines={1}>
        {PART2}
      </Text>
      <Text style={styles.marqueeText} numberOfLines={1}>
        {SEGMENT_GAP}
      </Text>
    </View>
  );
}

export function HomeAnnouncementBar() {
  const [segmentWidth, setSegmentWidth] = useState(0);
  const translateX = useSharedValue(0);

  const onSegmentLayout = useCallback((event: LayoutChangeEvent) => {
    const width = Math.ceil(event.nativeEvent.layout.width);
    if (width > 0) setSegmentWidth(width);
  }, []);

  useEffect(() => {
    if (segmentWidth <= 0) return;
    translateX.value = 0;
    translateX.value = withRepeat(
      withTiming(-segmentWidth, {
        duration: Math.max(segmentWidth * 22, 12000),
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, [segmentWidth, translateX]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Pressable style={styles.bar} onPress={() => router.push('/announcement' as never)}>
      <View style={styles.labelWrap}>
        <Ionicons name="megaphone-outline" size={12} color={theme.purple} />
        <Text style={styles.label} numberOfLines={1}>
          DUYURU
        </Text>
      </View>

      <View style={styles.track}>
        <Animated.View style={[styles.marquee, animStyle]}>
          <MarqueeSegment onLayout={onSegmentLayout} />
          <MarqueeSegment />
        </Animated.View>
      </View>

      <Ionicons name="chevron-forward" size={13} color={theme.purple} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 32,
    paddingRight: 6,
    paddingLeft: 4,
    borderRadius: 10,
    backgroundColor: 'rgba(138,43,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(138,43,255,0.3)',
    overflow: 'hidden',
  },
  labelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    height: 24,
    backgroundColor: 'rgba(138,43,255,0.25)',
    borderRadius: 7,
    marginRight: 6,
    flexShrink: 0,
  },
  label: {
    color: theme.purple,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.4,
    lineHeight: 12,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : null),
  },
  track: {
    flex: 1,
    overflow: 'hidden',
    height: 32,
    justifyContent: 'center',
  },
  marquee: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 32,
  },
  segment: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
    height: 32,
  },
  marqueeText: {
    color: theme.text,
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 14,
    flexShrink: 0,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : null),
  },
  highlight: {
    color: '#FFC400',
    fontWeight: '700',
  },
});
