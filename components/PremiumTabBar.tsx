import { useCallback } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getWorkoutDays } from '@/lib/database';
import { TAB_BAR_HEIGHT } from '@/lib/homeLayout';
import { DASHBOARD } from '@/lib/dashboardDefaults';

const tabs = [
  { name: 'index', label: 'Ana Sayfa', icon: 'home', iconOutline: 'home-outline' as const },
  { name: 'workout', label: 'Antrenman', icon: 'barbell', iconOutline: 'barbell-outline' as const },
  { name: 'start', label: 'Başlat', icon: 'add' as const, center: true },
  { name: 'diet', label: 'Diyet', icon: 'restaurant', iconOutline: 'restaurant-outline' as const },
  { name: 'tracking', label: 'Takip', icon: 'trending-up', iconOutline: 'trending-up-outline' as const },
];

export function PremiumTabBar({
  state,
  navigation,
}: {
  state: { index: number; routes: { name: string; key: string }[] };
  navigation: { navigate: (name: string) => void };
}) {
  const insets = useSafeAreaInsets();

  const startWorkout = useCallback(async () => {
    const days = await getWorkoutDays();
    if (days.length === 0) {
      router.push('/(tabs)/workout');
      return;
    }
    const todayIndex = (new Date().getDay() - 1 + days.length) % days.length;
    const day =
      days.find((d) => d.dayNumber === DASHBOARD.programDay) ??
      days[todayIndex];
    router.push({
      pathname: '/workout/[dayId]',
      params: { dayId: String(day.id) },
    });
  }, []);

  return (
    <View
      style={[
        styles.wrap,
        {
          height: TAB_BAR_HEIGHT + Math.max(insets.bottom, 0),
          paddingBottom: Math.max(insets.bottom, 6),
        },
      ]}>
      <View style={styles.pill}>
        {tabs.map((tab) => {
          const routeIndex = state.routes.findIndex((r: { name: string }) => r.name === tab.name);
          const isFocused =
            tab.name === 'start' ? false : state.index === (routeIndex >= 0 ? routeIndex : -1);

          if (tab.center) {
            return (
              <Pressable key={tab.name} style={styles.centerWrap} onPress={startWorkout}>
                <View style={styles.centerGlow} />
                <LinearGradient colors={['#9333EA', '#7C3AED']} style={styles.centerBtn}>
                  <Ionicons name="add" size={28} color="#fff" />
                </LinearGradient>
                <Text style={styles.centerLabel}>{tab.label}</Text>
              </Pressable>
            );
          }

          const onPress = () => {
            const idx = state.routes.findIndex((r: { name: string }) => r.name === tab.name);
            if (idx >= 0) navigation.navigate(state.routes[idx].name);
          };

          return (
            <Pressable key={tab.name} style={styles.tab} onPress={onPress}>
              <View style={[styles.iconWrap, isFocused && styles.iconActive]}>
                {isFocused && <View style={styles.activeGlow} />}
                <Ionicons
                  name={isFocused ? tab.icon : (tab.iconOutline ?? tab.icon)}
                  size={20}
                  color={isFocused ? '#C084FC' : '#9CA3AF'}
                />
              </View>
              <Text style={[styles.label, isFocused && styles.labelActive]} numberOfLines={1}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 0,
    paddingTop: 0,
    backgroundColor: 'transparent',
    zIndex: 100,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
      } as object,
      default: {},
    }),
  },
  pill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(10,12,20,0.94)',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingTop: 8,
    paddingBottom: 6,
    paddingHorizontal: 8,
    shadowColor: '#A855F7',
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -2 },
    elevation: 12,
  },
  tab: {
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
    paddingBottom: 2,
  },
  iconWrap: {
    width: 36,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    position: 'relative',
  },
  activeGlow: {
    position: 'absolute',
    width: 34,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(168,85,247,0.22)',
    shadowColor: '#A855F7',
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 4,
  },
  iconActive: {},
  label: {
    color: '#9CA3AF',
    fontSize: 7,
    fontWeight: '700',
    marginTop: 2,
    textAlign: 'center',
  },
  labelActive: { color: '#C084FC' },
  centerWrap: {
    alignItems: 'center',
    marginTop: -22,
    flex: 1,
    minWidth: 0,
  },
  centerGlow: {
    position: 'absolute',
    top: 2,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(168,85,247,0.25)',
    shadowColor: '#A855F7',
    shadowOpacity: 0.85,
    shadowRadius: 18,
    elevation: 14,
  },
  centerBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.12)',
    shadowColor: '#A855F7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.75,
    shadowRadius: 14,
    elevation: 12,
  },
  centerLabel: {
    color: '#9CA3AF',
    fontSize: 7,
    fontWeight: '700',
    marginTop: 3,
  },
});
