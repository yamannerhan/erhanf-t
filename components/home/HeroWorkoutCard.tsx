import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '@/components/GlassCard';
import { theme } from '@/constants/theme';
import type { WorkoutDay } from '@/lib/types';

const DAY_IMAGES: Record<number, number> = {
  1: require('@/assets/images/day1.png'),
  2: require('@/assets/images/day2.png'),
  3: require('@/assets/images/day3.png'),
};

interface HeroWorkoutCardProps {
  todayDay: WorkoutDay | null;
  days: WorkoutDay[];
  compact?: boolean;
}

export function HeroWorkoutCard({ todayDay, days, compact = false }: HeroWorkoutCardProps) {
  const [slide, setSlide] = useState(0);
  const activeDay = days.length > 0 ? days[slide % days.length] : todayDay;

  useEffect(() => {
    if (!todayDay || days.length === 0) return;
    const idx = days.findIndex((d) => d.id === todayDay.id);
    if (idx >= 0) setSlide(idx);
  }, [todayDay, days]);

  const startWorkout = () => {
    if (!activeDay) return;
    router.push({
      pathname: '/workout/session',
      params: { dayId: String(activeDay.id) },
    });
  };

  const openDetail = () => {
    if (!activeDay) return;
    router.push({
      pathname: '/workout/[dayId]',
      params: { dayId: String(activeDay.id) },
    });
  };

  const imageSource = activeDay
    ? DAY_IMAGES[activeDay.dayNumber] ?? { uri: activeDay.imageUri }
    : null;

  return (
    <GlassCard glow="purple" style={[styles.card, compact && styles.cardCompact]} borderColor="rgba(138,43,255,0.4)">
      <View style={styles.row}>
        <View style={styles.left}>
          <Text style={styles.label}>BUGÜNKÜ ANTRENMAN</Text>
          {activeDay ? (
            <>
              <Text style={styles.dayTitle}>{activeDay.title}</Text>
              <Text style={styles.muscle}>{activeDay.muscleGroups}</Text>
              <View style={styles.chips}>
                <View style={styles.chip}>
                  <Text style={styles.chipText}>⏱ 60 DK</Text>
                </View>
                <View style={[styles.chip, styles.chipOrange]}>
                  <Text style={styles.chipText}>🔥 520 KCAL</Text>
                </View>
              </View>
              <Pressable
                onPress={startWorkout}
                style={({ pressed }) => [pressed && styles.pressed]}>
                <LinearGradient
                  colors={['#8A2BFF', '#FF6B35', '#FFC400']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.startBtn, compact && styles.startBtnCompact]}>
                  <Ionicons name="play" size={compact ? 14 : 18} color="#fff" />
                  <Text style={[styles.startText, compact && styles.startTextCompact]}>Antrenmanı Başlat</Text>
                </LinearGradient>
              </Pressable>
              {!compact && (
              <Pressable onPress={openDetail} style={styles.detailLink}>
                <Text style={styles.detailLinkText}>Detayları Gör</Text>
              </Pressable>
              )}
            </>
          ) : (
            <Text style={styles.muscle}>Henüz antrenman eklenmedi</Text>
          )}
        </View>

        <Pressable style={styles.imageWrap} onPress={openDetail}>
          {imageSource ? (
            <Image source={imageSource} style={styles.heroImage} resizeMode="cover" />
          ) : (
            <LinearGradient
              colors={['rgba(138,43,255,0.35)', 'rgba(255,196,0,0.2)']}
              style={styles.placeholder}>
              <Ionicons name="barbell" size={42} color={theme.purple} />
            </LinearGradient>
          )}
          <LinearGradient
            colors={['rgba(8,11,20,0.85)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.imageFade}
          />
        </Pressable>
      </View>

      {days.length > 1 && (
        <View style={styles.dots}>
          {days.map((_, i) => (
            <Pressable key={i} onPress={() => setSlide(i)} hitSlop={8}>
              <View style={[styles.dot, i === slide && styles.dotActive]} />
            </Pressable>
          ))}
        </View>
      )}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: { padding: 12, minHeight: 155 },
  cardCompact: { padding: 10, minHeight: 0 },
  row: { flexDirection: 'row', alignItems: 'stretch', minHeight: 130 },
  left: { flex: 1, zIndex: 2, paddingRight: 8, justifyContent: 'center' },
  label: {
    color: theme.purple,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  dayTitle: {
    color: theme.text,
    fontSize: 22,
    fontWeight: '900',
    marginTop: 4,
  },
  muscle: { color: theme.textMuted, fontSize: 13, marginTop: 4 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  chip: {
    backgroundColor: 'rgba(138,43,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(138,43,255,0.35)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  chipOrange: {
    backgroundColor: 'rgba(255,196,0,0.15)',
    borderColor: 'rgba(255,196,0,0.35)',
  },
  chipText: { color: theme.text, fontSize: 10, fontWeight: '700' },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 14,
  },
  startBtnCompact: { marginTop: 8, paddingVertical: 8, borderRadius: 12 },
  startText: { color: '#fff', fontWeight: '900', fontSize: 13 },
  startTextCompact: { fontSize: 11 },
  detailLink: { marginTop: 8, alignSelf: 'flex-start' },
  detailLinkText: { color: theme.purple, fontSize: 11, fontWeight: '700' },
  pressed: { transform: [{ scale: 0.97 }], opacity: 0.9 },
  imageWrap: {
    width: 130,
    borderRadius: 16,
    overflow: 'hidden',
    alignSelf: 'stretch',
    maxHeight: 118,
  },
  heroImage: { width: '100%', height: '100%' },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 170,
  },
  imageFade: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 40,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  dotActive: {
    width: 18,
    backgroundColor: theme.purple,
  },
});
