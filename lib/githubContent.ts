import {
  GITHUB_ANNOUNCEMENTS_JSON_URLS,
  GITHUB_API_BASE,
  GITHUB_BROADCAST_JSON_URLS,
  GITHUB_REMINDERS_JSON_URLS,
  getGithubHeaders,
  getGithubToken,
} from '@/constants/github';

export interface AnnouncementsData {
  items: string[];
  updatedAt: string;
}

export interface BroadcastData {
  id: number;
  title: string;
  message: string;
  createdAt: string;
  active: boolean;
  scheduledAt?: string;
  repeatDaily?: boolean;
}

export interface ReminderItem {
  id: string;
  title: string;
  body: string;
  hour: number;
  minute: number;
  enabled?: boolean;
}

export interface RemindersData {
  meals: ReminderItem[];
  water: ReminderItem[];
  updatedAt: string;
}

interface GithubContentResponse {
  sha?: string;
  content?: string;
}

function fromBase64(content: string): string {
  const normalized = content.replace(/\n/g, '');
  const bytes = globalThis.atob(normalized);
  const out = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) {
    out[i] = bytes.charCodeAt(i);
  }
  return new TextDecoder().decode(out);
}

async function fetchGithubJsonApi<T>(path: string): Promise<T | null> {
  const token = getGithubToken();
  if (!token) return null;
  try {
    const response = await fetch(`${GITHUB_API_BASE}/contents/${path}`, {
      headers: getGithubHeaders(),
    });
    if (!response.ok) return null;
    const data = (await response.json()) as GithubContentResponse;
    if (!data.content) return null;
    return JSON.parse(fromBase64(data.content)) as T;
  } catch {
    return null;
  }
}

function toBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return globalThis.btoa(binary);
}

async function fetchJsonFromUrls<T>(urls: string[]): Promise<T | null> {
  for (const url of urls) {
    try {
      const response = await fetch(`${url}?t=${Date.now()}`, {
        headers: { ...getGithubHeaders(), Accept: 'application/json' },
      });
      if (!response.ok) continue;
      return (await response.json()) as T;
    } catch {
      // try next
    }
  }
  return null;
}

async function getRemoteFileSha(path: string): Promise<string | undefined> {
  const token = getGithubToken();
  if (!token) return undefined;
  try {
    const response = await fetch(`${GITHUB_API_BASE}/contents/${path}`, {
      headers: getGithubHeaders(),
    });
    if (!response.ok) return undefined;
    const data = (await response.json()) as GithubContentResponse;
    return data.sha;
  } catch {
    return undefined;
  }
}

export async function publishGithubJson(
  path: string,
  data: unknown,
  commitMessage: string
): Promise<void> {
  const token = getGithubToken();
  if (!token) {
    throw new Error('GitHub token bulunamadı. .env dosyasını kontrol edin.');
  }

  const content = JSON.stringify(data, null, 2);
  const sha = await getRemoteFileSha(path);

  const response = await fetch(`${GITHUB_API_BASE}/contents/${path}`, {
    method: 'PUT',
    headers: getGithubHeaders(),
    body: JSON.stringify({
      message: commitMessage,
      content: toBase64(content),
      ...(sha ? { sha } : {}),
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub kayıt hatası: ${response.status} ${body.slice(0, 120)}`);
  }
}

export async function fetchAnnouncementsData(preferApi = false): Promise<AnnouncementsData | null> {
  if (preferApi) {
    const fromApi = await fetchGithubJsonApi<AnnouncementsData>('announcements.json');
    if (fromApi) return fromApi;
  }
  const fromRaw = await fetchJsonFromUrls<AnnouncementsData>(GITHUB_ANNOUNCEMENTS_JSON_URLS);
  if (fromRaw) return fromRaw;
  if (getGithubToken()) {
    return fetchGithubJsonApi<AnnouncementsData>('announcements.json');
  }
  return null;
}

export async function fetchBroadcastData(): Promise<BroadcastData | null> {
  const data = await fetchJsonFromUrls<BroadcastData>(GITHUB_BROADCAST_JSON_URLS);
  if (!data?.active || !data.message?.trim()) return null;
  return data;
}

export async function fetchRemindersData(): Promise<RemindersData | null> {
  return fetchJsonFromUrls<RemindersData>(GITHUB_REMINDERS_JSON_URLS);
}

export async function publishAnnouncements(items: string[]): Promise<AnnouncementsData> {
  const payload: AnnouncementsData = {
    items: items.map((item) => item.trim()).filter(Boolean),
    updatedAt: new Date().toISOString(),
  };
  await publishGithubJson('announcements.json', payload, 'ERHAN FIT: duyurular güncellendi');
  return payload;
}

export async function publishBroadcast(
  title: string,
  message: string,
  options?: { scheduledAt?: string; repeatDaily?: boolean }
): Promise<BroadcastData> {
  const payload: BroadcastData = {
    id: Date.now(),
    title: title.trim() || 'ERHAN FIT',
    message: message.trim(),
    createdAt: new Date().toISOString(),
    active: true,
    scheduledAt: options?.scheduledAt,
    repeatDaily: options?.repeatDaily ?? false,
  };
  await publishGithubJson('broadcast.json', payload, 'ERHAN FIT: toplu bildirim');
  return payload;
}

export async function publishReminders(data: RemindersData): Promise<void> {
  const payload = { ...data, updatedAt: new Date().toISOString() };
  await publishGithubJson('reminders.json', payload, 'ERHAN FIT: hatırlatma saatleri');
}
