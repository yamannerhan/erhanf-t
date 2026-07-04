import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getPlanDone, togglePlanItem } from '@/lib/appMeta';

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

const PLAN = [
  {
    id: 'warmup',
    title: 'Isınma',
    subtitle: '10 dk kardiyo',
    icon: 'body' as const,
    colors: ['#A855F7', '#7C3AED'] as const,
  },
  {
    id: 'shoulder',
    title: 'Omuz Antrenmanı',
    subtitle: '5 hareket • 20 set',
    icon: 'barbell' as const,
    colors: ['#22C55E', '#16A34A'] as const,
  },
  {
    id: 'leg',
    title: 'Bacak Antrenmanı',
    subtitle: '5 hareket • 20 set',
    icon: 'barbell' as const,
    colors: ['#F59E0B', '#EA580C'] as const,
  },
];

export function TodayPlan() {
  const [done, setDone] = useState<string[]>(['warmup']);

  const load = useCallback(async () => {
    const d = await getPlanDone(todayStr());
    setDone(d.length ? d : ['warmup']);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggle = async (id: string) => {
    setDone(await togglePlanItem(todayStr(), id));
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>BUGÜNKÜ PLAN</Text>

      <View style={styles.list}>
        {PLAN.map((item) => {
          const completed = done.includes(item.id);
          return (
            <View key={item.id} style={styles.row}>
              <LinearGradient colors={item.colors} style={styles.iconBox}>
                <Ionicons name={item.icon} size={11} color="#fff" />
              </LinearGradient>
              <View style={styles.textCol}>
                <Text style={styles.itemTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.itemSub} numberOfLines={1}>
                  {item.subtitle}
                </Text>
              </View>
              <Pressable
                style={[styles.check, completed && styles.checkDone]}
                onPress={() => toggle(item.id)}>
                {completed && <Ionicons name="checkmark" size={10} color="#0a0a0a" />}
              </Pressable>
            </View>
          );
        })}
      </View>

      <Pressable style={styles.footerBtn} onPress={() => router.push('/(tabs)/workout')}>
        <Text style={styles.footerText}>Tüm Planı Gör</Text>
        <Ionicons name="chevron-forward" size={11} color="#C084FC" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignSelf: 'stretch',
    flexDirection: 'column',
    backgroundColor: '#070B12',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 6,
    paddingTop: 6,
    paddingBottom: 5,
    minWidth: 0,
    minHeight: 0,
    overflow: 'hidden',
  },
  title: {
    color: '#B8BBC7',
    fontSize: 7,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 3,
    flexShrink: 0,
  },
  list: {
    flex: 1,
    justifyContent: 'space-between',
    minHeight: 0,
    gap: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    minHeight: 22,
    flexShrink: 0,
  },
  iconBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textCol: { flex: 1, minWidth: 0 },
  itemTitle: {
    color: '#F8FAFC',
    fontSize: 8,
    fontWeight: '800',
  },
  itemSub: {
    color: '#71717A',
    fontSize: 6,
    fontWeight: '500',
    marginTop: 1,
  },
  check: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkDone: {
    backgroundColor: '#FBBF24',
    borderColor: '#FBBF24',
  },
  footerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    marginTop: 3,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(168,85,247,0.35)',
    backgroundColor: 'rgba(138,43,255,0.12)',
    flexShrink: 0,
  },
  footerText: {
    color: '#C084FC',
    fontSize: 8,
    fontWeight: '700',
  },
});
