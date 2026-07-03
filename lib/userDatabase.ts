import * as Crypto from 'expo-crypto';
import type { UserRole } from './auth';

const USERS_KEY = 'erhanfit_users';

interface StoredUser {
  username: string;
  passwordHash: string;
  role: UserRole;
}

function loadUsers(): StoredUser[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
}

export async function hashPassword(password: string): Promise<string> {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);
}

export async function getUserRoleByCredentials(
  username: string,
  passwordHash: string
): Promise<UserRole | null> {
  const user = loadUsers().find(
    (u) => u.username === username && u.passwordHash === passwordHash
  );
  return user?.role ?? null;
}

export async function insertAppUser(
  username: string,
  password: string,
  role: UserRole
): Promise<void> {
  const users = loadUsers();
  const normalized = username.trim().toLowerCase();
  if (users.some((u) => u.username === normalized)) {
    throw new Error('Bu kullanıcı adı zaten var');
  }
  const passwordHash = await hashPassword(password);
  users.push({ username: normalized, passwordHash, role });
  saveUsers(users);
}

export async function getAllAppUsers(): Promise<{ username: string; role: UserRole }[]> {
  return loadUsers().map((u) => ({ username: u.username, role: u.role }));
}
