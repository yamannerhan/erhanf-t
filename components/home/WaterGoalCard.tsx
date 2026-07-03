import { useCallback, useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/components/AppProvider';
import { theme } from '@/constants/theme';
import { getWaterForDate } from '@/lib/database';

const WATER_BOTTLE = require('@/assets/images/water-bottle.png');

const GLASS_COUNT = 6;
const GOAL_ML = theme.waterGoalMl;

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

function formatLiters(ml: number) {
  return (ml / 1000).toFixed(1);
}

function WaterGlass({ fill }: { fill: number }) {
  const clamped = Math.max(0, Math.min(1, fill));

  return (
    <View style={styles.glassRing}>
      <View style={styles.glassCup}>
        <View style={styles.glassOutline} />
        <View style={styles.glassFillWrap}>
          <LinearGradient
            colors={['#2563EB', '#60A5FA', '#93C5FD']}
            style={[styles.glassFill, { height: `${clamped * 100}%` }]}
          />
        </View>
      </View>
    </View>
  );
}

function WaterBottleGraphic() {
  return (
    <View style={styles.bottleWrap}>
      <View style={styles.bottleGlow} />
      <Image source={WATER_BOTTLE} style={styles.bottleImg} resizeMode="contain" />
    </View>
  );
}

export function WaterGoalCard() {
  const { ready, refreshKey } = useApp();
  const [totalMl, setTotalMl] = useState(0);

  const load = useCallback(async () => {
    setTotalMl(await getWaterForDate(todayStr()));
  }, []);

  useEffect(() => {
    if (ready) load();
  }, [ready, refreshKey, load]);

  const progress = Math.min(totalMl / GOAL_ML, 1);
  const totalFill = progress * GLASS_COUNT;
  const currentL = formatLiters(totalMl);
  const goalL = formatLiters(GOAL_ML);

  return (
    <Pressable style={styles.card} onPress={() => router.push('/water' as never)}>
      <View style={styles.body}>
        <View style={styles.left}>
          <View style={styles.titleRow}>
            <Ionicons name="water" size={11} color="#60A5FA" />
            <Text style={styles.title}>SU HEDEFİN</Text>
          </View>

          <Text style={styles.amount} numberOfLines={1}>
            <Text style={styles.amountMain}>{currentL}</Text>
            <Text style={styles.amountSlash}> / </Text>
            <Text style={styles.amountMain}>{goalL} L</Text>
          </Text>

          <View style={styles.glasses}>
            {Array.from({ length: GLASS_COUNT }).map((_, i) => (
              <WaterGlass key={i} fill={Math.max(0, Math.min(1, totalFill - i))} />
            ))}
          </View>
        </View>

        <WaterBottleGraphic />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#070B12',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(47,128,255,0.22)',
    paddingHorizontal: 6,
    paddingVertical: 6,
    minWidth: 0,
    minHeight: 0,
    overflow: 'hidden',
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 2,
    minHeight: 0,
  },
  left: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
    zIndex: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  title: {
    color: '#E2E8F0',
    fontSize: 6.5,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  amount: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  amountMain: {
    color: '#F8FAFC',
  },
  amountSlash: {
    color: '#A855F7',
    fontWeight: '800',
  },
  glasses: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
  },
  glassRing: {
    width: 16,
    height: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.45)',
    backgroundColor: 'rgba(37,99,235,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3B82F6',
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 2,
  },
  glassCup: {
    width: 10,
    height: 12,
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  glassOutline: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 1,
    bottom: 0,
    borderWidth: 1,
    borderColor: 'rgba(147,197,253,0.55)',
    borderTopWidth: 1.5,
    borderRadius: 2,
  },
  glassFillWrap: {
    position: 'absolute',
    left: 1,
    right: 1,
    bottom: 0,
    top: 2,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    borderRadius: 1,
  },
  glassFill: {
    width: '100%',
    borderRadius: 1,
  },
  bottleWrap: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    position: 'relative',
  },
  bottleGlow: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(59,130,246,0.2)',
    bottom: 2,
    right: 0,
  },
  bottleImg: {
    width: 40,
    height: 40,
    zIndex: 1,
  },
});
