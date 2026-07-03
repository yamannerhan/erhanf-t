import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { fetchBroadcastData, type BroadcastData } from '@/lib/githubContent';

const LAST_BROADCAST_KEY = 'erhanfit_last_broadcast_id';

async function getLastBroadcastId(): Promise<number> {
  try {
    if (Platform.OS === 'web') {
      const raw = localStorage.getItem(LAST_BROADCAST_KEY);
      return raw ? Number(raw) : 0;
    }
    const raw = await SecureStore.getItemAsync(LAST_BROADCAST_KEY);
    return raw ? Number(raw) : 0;
  } catch {
    return 0;
  }
}

export async function markBroadcastSeen(id: number): Promise<void> {
  const value = String(id);
  if (Platform.OS === 'web') {
    localStorage.setItem(LAST_BROADCAST_KEY, value);
    return;
  }
  await SecureStore.setItemAsync(LAST_BROADCAST_KEY, value);
}

function isBroadcastDue(broadcast: BroadcastData): boolean {
  if (!broadcast.scheduledAt) return true;
  return new Date(broadcast.scheduledAt).getTime() <= Date.now();
}

export async function fetchPendingBroadcast(): Promise<BroadcastData | null> {
  const broadcast = await fetchBroadcastData();
  if (!broadcast) return null;
  if (!isBroadcastDue(broadcast)) return null;

  const lastSeen = await getLastBroadcastId();
  if (broadcast.id <= lastSeen) return null;
  return broadcast;
}

export async function fetchBroadcastForAdminPreview(
  forceId?: number
): Promise<BroadcastData | null> {
  const broadcast = await fetchBroadcastData();
  if (!broadcast) return null;
  if (forceId && broadcast.id !== forceId) return null;
  if (!isBroadcastDue(broadcast)) return null;
  return broadcast;
}
