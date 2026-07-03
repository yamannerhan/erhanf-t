import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
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

const ANNOUNCEMENT_PARTS = [
  { text: 'Yaz kampanyamız başladı! • ', highlight: false },
  { text: 'Tüm premium üyeliklerde %20 indirim seni bekliyor!', highlight: true },
] as const;

function AnnouncementText() {
  return (
    <Text style={styles.marqueeText}>
      {ANNOUNCEMENT_PARTS.map((part, i) => (
        <Text key={i} style={part.highlight ? styles.highlight : undefined}>
          {part.text}
        </Text>
      ))}
      <Text>{'     •     '}</Text>
    </Text>
  );
}

export function HomeAnnouncementBar() {
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(-340, { duration: 14000, easing: Easing.linear }),
      -1,
      false
    );
  }, [translateX]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Pressable style={styles.bar} onPress={() => router.push('/announcement' as never)}>
      <View style={styles.labelWrap}>
        <Ionicons name="megaphone" size={13} color={theme.purple} />
        <Text style={styles.label}>DUYURU</Text>
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.marquee, animStyle]}>
          <AnnouncementText />
          <AnnouncementText />
        </Animated.View>
      </View>
      <Ionicons name="chevron-forward" size={14} color={theme.purple} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 28,
    marginBottom: 3,
    paddingRight: 10,
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
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: 'rgba(138,43,255,0.25)',
    borderRadius: 8,
    marginRight: 8,
  },
  label: { color: theme.purple, fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
  track: { flex: 1, overflow: 'hidden', height: 28, justifyContent: 'center' },
  marquee: { flexDirection: 'row' },
  marqueeText: { color: theme.text, fontSize: 11, fontWeight: '600', flexShrink: 0 },
  highlight: { color: '#FFC400', fontWeight: '700' },
});
