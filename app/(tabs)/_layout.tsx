import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { PremiumTabBar } from '@/components/PremiumTabBar';
import { theme } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <PremiumTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.purple,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          height: 78,
        },
      }}>
      <Tabs.Screen name="index" options={{ title: 'Ana Sayfa' }} />
      <Tabs.Screen name="workout" options={{ title: 'Antrenman' }} />
      <Tabs.Screen name="diet" options={{ title: 'Diyet' }} />
      <Tabs.Screen name="tracking" options={{ title: 'Takip' }} />
    </Tabs>
  );
}
