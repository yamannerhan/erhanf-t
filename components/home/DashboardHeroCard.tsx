import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { HERO_MAX_HEIGHT } from '@/lib/homeLayout';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ProgressRing } from '@/components/ProgressRing';
import { DASHBOARD } from '@/lib/dashboardDefaults';
import { theme } from '@/constants/theme';
import type { WorkoutDay } from '@/lib/types';

const HERO_IMAGE = require('@/assets/images/hero-athlete.jpg');

interface DashboardHeroCardProps {
  todayDay: WorkoutDay | null;
}

export function DashboardHeroCard({ todayDay }: DashboardHeroCardProps) {
  const { width } = useWindowDimensions();
  const scale = Math.min(Math.max(width / 390, 0.88), 1.15);
  const cardH = Math.min(HERO_MAX_HEIGHT, Math.round(176 * scale));
  const [slide, setSlide] = useState(1);

  useEffect(() => {
    if (!todayDay) return;
    setSlide(Math.max(0, todayDay.dayNumber - 1));
  }, [todayDay]);

  const title = todayDay?.title ?? DASHBOARD.workoutTitle;
  const muscle = todayDay?.muscleGroups ?? DASHBOARD.workoutMuscle;

  const startWorkout = () => {
    if (!todayDay) return;
    router.push({ pathname: '/workout/session', params: { dayId: String(todayDay.id) } });
  };

  return (
    <View style={styles.wrap}>
      <View style={[styles.card, { height: cardH, maxHeight: HERO_MAX_HEIGHT }]}>
        <View style={styles.base} />

        <Image source={HERO_IMAGE} style={styles.heroImage} resizeMode="cover" />

        <LinearGradient
          colors={['#05050c', 'rgba(5,5,12,0.92)', 'rgba(5,5,12,0.35)', 'transparent']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 0.58, y: 0.5 }}
          style={styles.leftFade}
        />

        <View style={styles.left}>
          <View style={styles.labelRow}>
            <Text style={styles.plus}>++</Text>
            <Text style={styles.label}>{DASHBOARD.workoutLabel}</Text>
          </View>

          <Text style={[styles.dayTitle, { fontSize: Math.round(22 * scale), lineHeight: Math.round(24 * scale) }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}>
            {title}
          </Text>
          <Text style={[styles.muscle, { fontSize: Math.round(11 * scale) }]} numberOfLines={1}>
            {muscle}
          </Text>

          <View style={styles.chips}>
            <View style={styles.chip}>
              <Ionicons name="time-outline" size={11} color="#fff" />
              <Text style={styles.chipText}>{DASHBOARD.duration}</Text>
            </View>
            <View style={styles.chip}>
              <Ionicons name="flame" size={11} color={theme.gold} />
              <Text style={styles.chipText}>{DASHBOARD.burn}</Text>
            </View>
          </View>

          <Pressable onPress={startWorkout} style={({ pressed }) => [pressed && styles.pressed]}>
            <LinearGradient
              colors={['#8A2BFF', '#C026D3', '#FF6B35', '#FFC400']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              locations={[0, 0.35, 0.72, 1]}
              style={styles.startBtn}>
              <Ionicons name="play" size={15} color="#fff" />
              <Text style={styles.startText}>Antrenmanı Başlat</Text>
            </LinearGradient>
          </Pressable>
        </View>

        <Pressable style={[styles.panel, { width: width < 380 ? '28%' : '31%', minWidth: width < 360 ? 88 : 100 }]} onPress={() => router.push('/start-date' as never)}>
          <LinearGradient
            colors={['rgba(10,12,22,0.92)', 'rgba(6,8,16,0.8)']}
            style={styles.panelInner}>
            <View style={styles.panelBlock}>
              <Text style={styles.panelTitle}>SPORA BAŞLAMA{'\n'}TARİHİ</Text>
              <View style={styles.dateRow}>
                <Ionicons name="calendar-outline" size={10} color="#CBD5E1" />
                <Text style={styles.panelDate} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
                  {DASHBOARD.startDateLabel}
                </Text>
              </View>
            </View>

            <View style={[styles.ringSection, { height: Math.round(46 * scale) }]}>
              <ProgressRing
                size={Math.round(46 * scale)}
                stroke={4}
                progress={DASHBOARD.programDay / DASHBOARD.programTotal}
                color="#A855F7">
                <View style={styles.ringCenter}>
                  <Text style={styles.ringNum}>{DASHBOARD.programDay}</Text>
                  <Text style={styles.ringLbl}>GÜN</Text>
                </View>
              </ProgressRing>
            </View>

            <View style={styles.panelBottom}>
              <Text style={styles.totalLabel}>Toplam Süre</Text>
              <Text style={styles.totalValue}>
                <Text style={styles.totalHighlight}>{DASHBOARD.programDay}</Text>
                <Text style={styles.totalRest}> / {DASHBOARD.programTotal} Gün</Text>
              </Text>
              <View style={styles.detailBtn}>
                <Text style={styles.detailText}>Detayları Gör</Text>
              </View>
            </View>
          </LinearGradient>
        </Pressable>
      </View>

      <View style={styles.dots}>
        {[0, 1, 2, 3, 4].map((i) => (
          <View key={i} style={[styles.dot, i === slide && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%' },
  card: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(138,43,255,0.42)',
    backgroundColor: '#05050c',
    width: '100%',
  },
  base: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#000',
  },
  heroImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  leftFade: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '55%',
    zIndex: 1,
  },
  left: {
    position: 'absolute',
    left: 10,
    top: 0,
    bottom: 0,
    width: '52%',
    maxWidth: '58%',
    justifyContent: 'center',
    zIndex: 2,
    paddingRight: 4,
  },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  plus: {
    color: theme.purple,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  label: {
    color: theme.purple,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  dayTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 4,
    lineHeight: 24,
  },
  muscle: {
    color: 'rgba(248,250,252,0.92)',
    fontSize: 11,
    marginTop: 2,
    fontWeight: '600',
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 6 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  chipText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: 'stretch',
    maxWidth: '100%',
    shadowColor: '#FF6B35',
    shadowOpacity: 0.55,
    shadowRadius: 14,
    elevation: 8,
  },
  startText: { color: '#fff', fontWeight: '900', fontSize: 12 },
  pressed: { opacity: 0.92, transform: [{ scale: 0.98 }] },
  panel: {
    position: 'absolute',
    right: 8,
    top: 6,
    bottom: 6,
    maxWidth: 120,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(138,43,255,0.5)',
    zIndex: 10,
    elevation: 12,
    shadowColor: '#8A2BFF',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
  },
  panelInner: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 7,
    paddingHorizontal: 6,
    minHeight: 0,
  },
  panelBlock: {
    width: '100%',
    alignItems: 'center',
    flexShrink: 0,
  },
  ringSection: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 54,
    flexShrink: 0,
  },
  panelBottom: {
    width: '100%',
    alignItems: 'center',
    flexShrink: 0,
    paddingBottom: 1,
  },
  panelTitle: {
    color: '#9CA3AF',
    fontSize: 7.5,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.5,
    lineHeight: 10,
    textTransform: 'uppercase',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    marginTop: 3,
    width: '100%',
  },
  panelDate: {
    color: '#F8FAFC',
    fontSize: 8,
    fontWeight: '700',
    flexShrink: 1,
  },
  ringCenter: { alignItems: 'center', justifyContent: 'center' },
  ringNum: { color: '#FFFFFF', fontSize: 17, fontWeight: '900', lineHeight: 19 },
  ringLbl: { color: '#9CA3AF', fontSize: 7, fontWeight: '800' },
  totalLabel: {
    color: '#9CA3AF',
    fontSize: 7,
    fontWeight: '600',
    textAlign: 'center',
  },
  totalValue: {
    fontSize: 8,
    fontWeight: '700',
    marginTop: 1,
    textAlign: 'center',
  },
  totalHighlight: { color: '#FFC400', fontWeight: '800' },
  totalRest: { color: '#E2E8F0', fontWeight: '600' },
  detailBtn: {
    marginTop: 4,
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
    alignSelf: 'center',
  },
  detailText: { color: '#F8FAFC', fontSize: 7, fontWeight: '700' },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
    marginTop: 4,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.25)' },
  dotActive: { width: 18, backgroundColor: theme.purple },
});
