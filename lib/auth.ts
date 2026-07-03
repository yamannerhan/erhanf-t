import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export type UserRole = 'admin' | 'user';

export interface AuthSession {
  username: string;
  role: UserRole;
}

const SESSION_KEY = 'erhanfit_session';
export const ADMIN_USERNAME = 'yamann01';
const ADMIN_PASSWORD_HASH =
  '45586718b8617ac34117d1582e555b2bcfa00af01ef2e1c9bf6b128618d8701c';

export async function hashPassword(password: string): Promise<string> {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);
}

async function saveSession(session: AuthSession) {
  const data = JSON.stringify(session);
  if (Platform.OS === 'web') {
    localStorage.setItem(SESSION_KEY, data);
  } else {
    await SecureStore.setItemAsync(SESSION_KEY, data);
  }
}

async function loadSession(): Promise<AuthSession | null> {
  try {
    let raw: string | null = null;
    if (Platform.OS === 'web') {
      raw = localStorage.getItem(SESSION_KEY);
    } else {
      raw = await SecureStore.getItemAsync(SESSION_KEY);
    }
    if (!raw) return null;
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export async function clearSession() {
  if (Platform.OS === 'web') {
    localStorage.removeItem(SESSION_KEY);
  } else {
    await SecureStore.deleteItemAsync(SESSION_KEY);
  }
}

export async function login(
  username: string,
  password: string,
  verifyUser?: (u: string, hash: string) => Promise<UserRole | null>
): Promise<AuthSession | null> {
  const normalized = username.trim().toLowerCase();
  const passHash = await hashPassword(password);

  if (normalized === ADMIN_USERNAME && passHash === ADMIN_PASSWORD_HASH) {
    const session: AuthSession = { username: ADMIN_USERNAME, role: 'admin' };
    await saveSession(session);
    return session;
  }

  if (verifyUser) {
    const role = await verifyUser(normalized, passHash);
    if (role) {
      const session: AuthSession = { username: normalized, role };
      await saveSession(session);
      return session;
    }
  }

  return null;
}

export async function getSession(): Promise<AuthSession | null> {
  return loadSession();
}

export async function logout() {
  await clearSession();
}
