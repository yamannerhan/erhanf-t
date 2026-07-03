import { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';

import { AppProvider, useApp } from '@/components/AppProvider';
import { AuthProvider, useAuth } from '@/components/AuthProvider';
import { BroadcastOverlay } from '@/components/BroadcastOverlay';
import { BroadcastProvider, useBroadcast } from '@/components/BroadcastProvider';
import { GlobalUpdateModal } from '@/components/GlobalUpdateModal';
import { SplashOverlay } from '@/components/SplashOverlay';
import { theme } from '@/constants/theme';
import { fetchPendingBroadcast } from '@/lib/githubBroadcast';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

function AuthGate({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    const onLogin = segments[0] === 'login';
    if (!session && !onLogin) {
      router.replace('/login');
    } else if (session && onLogin) {
      router.replace('/(tabs)');
    }
  }, [session, loading, segments, router]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return <>{children}</>;
}

function RootContent() {
  const { ready, seeding, seedMessage } = useApp();
  const { activeBroadcast, showBroadcast, dismissBroadcast } = useBroadcast();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (ready) {
      const timer = setTimeout(() => setShowSplash(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [ready]);

  useEffect(() => {
    if (!ready || showSplash || seeding) return;
    fetchPendingBroadcast().then((item) => {
      if (item) showBroadcast(item);
    });
    const timer = setInterval(() => {
      fetchPendingBroadcast().then((item) => {
        if (item) showBroadcast(item);
      });
    }, 60 * 1000);
    return () => clearInterval(timer);
  }, [ready, showSplash, seeding, showBroadcast]);

  return (
    <>
      <StatusBar style="light" />
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        <View style={{ flex: 1 }}>
          <AuthGate>
            <Stack
          screenOptions={{
            headerStyle: { backgroundColor: theme.background },
            headerTintColor: theme.text,
            headerTitleStyle: { fontWeight: '800' },
            contentStyle: { backgroundColor: theme.background },
          }}>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="announcement" options={{ title: 'Duyurular', presentation: 'card' }} />
          <Stack.Screen name="water" options={{ title: 'Su Takibi', presentation: 'card' }} />
          <Stack.Screen name="stats" options={{ title: 'İstatistikler', presentation: 'card' }} />
          <Stack.Screen name="achievements" options={{ title: 'Başarılar', presentation: 'card' }} />
          <Stack.Screen name="notifications" options={{ title: 'Bildirimler', presentation: 'card' }} />
          <Stack.Screen name="start-date" options={{ title: 'Spora Başlama', presentation: 'card' }} />
          <Stack.Screen name="admin" options={{ title: 'Admin Paneli', presentation: 'modal' }} />
          <Stack.Screen
            name="workout/[dayId]"
            options={{ headerShown: false, presentation: 'card' }}
          />
          <Stack.Screen
            name="workout/session"
            options={{ title: 'Antrenman', headerShown: false, presentation: 'fullScreenModal' }}
          />
          <Stack.Screen
            name="workout/upload"
            options={{ title: 'Gün Ekle', presentation: 'modal' }}
          />
        <Stack.Screen
          name="workout/add-exercise"
          options={{ title: 'Resim Ekle', presentation: 'modal' }}
        />
          <Stack.Screen
            name="diet/upload"
            options={{ title: 'Diyet Yükle', presentation: 'modal' }}
          />
          <Stack.Screen
            name="diet/add-meal"
            options={{ title: 'Öğün Ekle', presentation: 'modal' }}
          />
          <Stack.Screen
            name="settings"
            options={{ title: 'Ayarlar', presentation: 'modal' }}
            />
          </Stack>
          </AuthGate>
        </View>
      </View>
      <GlobalUpdateModal enabled={ready && !showSplash && !seeding} />
      <BroadcastOverlay broadcast={activeBroadcast} onDismiss={dismissBroadcast} />
      <SplashOverlay visible={showSplash || seeding} message={seeding ? seedMessage : undefined} />
    </>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <AuthProvider>
      <AppProvider>
        <BroadcastProvider>
          <RootContent />
        </BroadcastProvider>
      </AppProvider>
    </AuthProvider>
  );
}
