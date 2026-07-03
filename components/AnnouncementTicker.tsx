import { useCallback, useEffect, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import {
  fetchGithubAnnouncements,
  formatAnnouncementsTicker,
} from '@/lib/githubAnnouncements';

const BAR_HEIGHT = 36;

export function AnnouncementTicker() {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const [textWidth, setTextWidth] = useState(0);
  const translateX = useSharedValue(0);

  const load = useCallback(async () => {
    const items = await fetchGithubAnnouncements(true);
    setText(formatAnnouncementsTicker(items));
  }, []);

  useEffect(() => {
    load();
    const timer = setInterval(load, 2 * 60 * 1000);
    return () => clearInterval(timer);
  }, [load]);

  useEffect(() => {
    if (textWidth <= 0) return;
    translateX.value = 0;
    translateX.value = withRepeat(
      withTiming(-textWidth, {
        duration: Math.max(textWidth * 20, 15000),
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, [textWidth, text, translateX]);

  const onTextLayout = useCallback((event: LayoutChangeEvent) => {
    const width = Math.ceil(event.nativeEvent.layout.width);
    if (width > 0) setTextWidth(width);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  if (!text) return null;

  const segment = `${text}     ◆     `;

  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      <View style={styles.bar}>
        <Ionicons name="megaphone" size={15} color={theme.warning} />
        <View style={styles.track}>
          <Animated.View style={[styles.marqueeRow, animatedStyle]}>
            <Text style={styles.marqueeText} onLayout={onTextLayout} numberOfLines={1}>
              {segment}
            </Text>
            <Text style={styles.marqueeText} numberOfLines={1}>
              {segment}
            </Text>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: theme.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.cardBorder,
  },
  bar: {
    height: BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
    backgroundColor: theme.card,
    overflow: 'hidden',
  },
  track: {
    flex: 1,
    height: BAR_HEIGHT,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  marqueeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: BAR_HEIGHT,
  },
  marqueeText: {
    color: theme.warning,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: BAR_HEIGHT,
    includeFontPadding: false,
    flexShrink: 0,
  },
});
