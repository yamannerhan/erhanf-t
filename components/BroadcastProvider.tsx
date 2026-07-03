import React, { createContext, useCallback, useContext, useState } from 'react';
import type { BroadcastData } from '@/lib/githubContent';
import { markBroadcastSeen } from '@/lib/githubBroadcast';

interface BroadcastContextValue {
  activeBroadcast: BroadcastData | null;
  showBroadcast: (data: BroadcastData) => void;
  dismissBroadcast: () => Promise<void>;
}

const BroadcastContext = createContext<BroadcastContextValue>({
  activeBroadcast: null,
  showBroadcast: () => {},
  dismissBroadcast: async () => {},
});

export function BroadcastProvider({ children }: { children: React.ReactNode }) {
  const [activeBroadcast, setActiveBroadcast] = useState<BroadcastData | null>(null);

  const showBroadcast = useCallback((data: BroadcastData) => {
    setActiveBroadcast(data);
  }, []);

  const dismissBroadcast = useCallback(async () => {
    if (activeBroadcast) {
      await markBroadcastSeen(activeBroadcast.id);
    }
    setActiveBroadcast(null);
  }, [activeBroadcast]);

  return (
    <BroadcastContext.Provider value={{ activeBroadcast, showBroadcast, dismissBroadcast }}>
      {children}
    </BroadcastContext.Provider>
  );
}

export function useBroadcast() {
  return useContext(BroadcastContext);
}
