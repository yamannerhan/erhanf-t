import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getDatabase } from '@/lib/database';
import { seedDatabaseIfNeeded } from '@/lib/seedData';
import { scheduleAllReminders } from '@/lib/notifications';
import { syncRemindersFromGithub } from '@/lib/reminderSettings';

interface AppContextValue {
  ready: boolean;
  seeding: boolean;
  seedMessage: string;
  refreshKey: number;
  refresh: () => void;
}

const AppContext = createContext<AppContextValue>({
  ready: false,
  seeding: false,
  seedMessage: '',
  refreshKey: 0,
  refresh: () => {},
});

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error(`${label} timeout`)), ms);
    }),
  ]);
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [seeding, setSeeding] = useState(true);
  const [seedMessage, setSeedMessage] = useState('Yükleniyor...');
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        await withTimeout(getDatabase(), 8000, 'database');
        await withTimeout(
          seedDatabaseIfNeeded((msg) => {
            if (mounted) setSeedMessage(msg);
          }),
          12000,
          'seed'
        );
        if (mounted) setSeedMessage('Hazırlanıyor...');
        const { ensureDashboardDemoData } = await import('@/lib/demoData');
        await withTimeout(ensureDashboardDemoData(), 8000, 'demo');
      } catch (e) {
        console.error('Init error:', e);
        if (mounted) setSeedMessage('Başlatılıyor...');
      } finally {
        if (mounted) {
          setSeeding(false);
          setReady(true);
        }
      }

      scheduleAllReminders().catch(() => {});
      syncRemindersFromGithub().catch(() => {});
    }

    init();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <AppContext.Provider value={{ ready, seeding, seedMessage, refreshKey, refresh }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
