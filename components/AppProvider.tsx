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
        await getDatabase();
        await seedDatabaseIfNeeded((msg) => {
          if (mounted) setSeedMessage(msg);
        });
        if (mounted) setSeedMessage('Demo veriler yükleniyor...');
        const { ensureDashboardDemoData } = await import('@/lib/demoData');
        await ensureDashboardDemoData();
        await scheduleAllReminders();
        try {
          await syncRemindersFromGithub();
        } catch {
          // GitHub hatırlatmaları yoksa varsayılanlar kalır
        }
        if (mounted) {
          setSeeding(false);
          setReady(true);
        }
      } catch (e) {
        console.error('Init error:', e);
        if (mounted) {
          setSeedMessage('Hata oluştu, yeniden deneyin');
          setSeeding(false);
          setReady(true);
        }
      }
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
