import * as FileSystem from 'expo-file-system/legacy';
import * as IntentLauncher from 'expo-intent-launcher';
import Constants from 'expo-constants';
import { Alert, Linking, Platform } from 'react-native';
import {
  getGithubHeaders,
  getGithubToken,
  GITHUB_RELEASES_LIST_URL,
  GITHUB_RELEASES_URL,
} from '@/constants/github';

export interface ReleaseInfo {
  version: string;
  tag: string;
  name: string;
  notes: string;
  apkUrl: string;
  publishedAt: string;
}

function parseVersion(tag: string): string {
  return tag.replace(/^v/i, '').trim();
}

function compareVersions(current: string, latest: string): number {
  const a = current.split('.').map(Number);
  const b = latest.split('.').map(Number);
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const diff = (b[i] ?? 0) - (a[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

export function getCurrentAppVersion(): string {
  return Constants.expoConfig?.version ?? '1.0.0';
}

function releaseFromData(data: {
  tag_name?: string;
  name?: string;
  body?: string;
  published_at?: string;
  assets?: { name: string; browser_download_url: string }[];
}): ReleaseInfo | null {
  const apkAsset = (data.assets ?? []).find((a) => a.name.toLowerCase().endsWith('.apk'));
  if (!apkAsset?.browser_download_url) return null;

  const tag = data.tag_name ?? '0.0.0';
  return {
    version: parseVersion(tag),
    tag,
    name: data.name ?? tag,
    notes: data.body ?? '',
    apkUrl: apkAsset.browser_download_url,
    publishedAt: data.published_at ?? '',
  };
}

async function fetchReleasesList(): Promise<ReleaseInfo | null> {
  try {
    const response = await fetch(GITHUB_RELEASES_LIST_URL, {
      headers: getGithubHeaders(),
    });
    if (!response.ok) return null;
    const list = await response.json();
    if (!Array.isArray(list) || list.length === 0) return null;
    return releaseFromData(list[0]);
  } catch {
    return null;
  }
}

export async function fetchLatestRelease(): Promise<ReleaseInfo | null> {
  try {
    const response = await fetch(GITHUB_RELEASES_URL, {
      headers: getGithubHeaders(),
    });

    if (response.status === 404) {
      return fetchReleasesList();
    }

    if (!response.ok) {
      return fetchReleasesList();
    }

    const data = await response.json();
    return releaseFromData(data);
  } catch {
    return null;
  }
}

export async function checkForUpdate(): Promise<{
  hasUpdate: boolean;
  current: string;
  latest: ReleaseInfo | null;
  noReleaseYet: boolean;
}> {
  const current = getCurrentAppVersion();
  const latest = await fetchLatestRelease();

  if (!latest) {
    return { hasUpdate: false, current, latest: null, noReleaseYet: true };
  }

  const hasUpdate = compareVersions(current, latest.version) > 0;
  return { hasUpdate, current, latest, noReleaseYet: false };
}

async function installApk(fileUri: string) {
  const contentUri = await FileSystem.getContentUriAsync(fileUri);

  try {
    await IntentLauncher.startActivityAsync('android.intent.action.INSTALL_PACKAGE', {
      data: contentUri,
      flags: 1,
    });
  } catch {
    await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
      data: contentUri,
      flags: 1,
      type: 'application/vnd.android.package-archive',
    });
  }
}

export async function downloadAndInstallApk(
  apkUrl: string,
  onProgress?: (pct: number) => void
): Promise<void> {
  if (Platform.OS === 'web') {
    Linking.openURL(apkUrl);
    return;
  }

  if (Platform.OS !== 'android') {
    Alert.alert('Bilgi', 'APK güncellemesi sadece Android cihazlarda desteklenir.');
    return;
  }

  const headers: Record<string, string> = {};
  const token = getGithubToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const dest = `${FileSystem.cacheDirectory}erhan-fit-update.apk`;

  try {
    await FileSystem.deleteAsync(dest, { idempotent: true });
  } catch {
    // ignore
  }

  onProgress?.(0);

  const download = FileSystem.createDownloadResumable(
    apkUrl,
    dest,
    { headers },
    (progress) => {
      const pct = progress.totalBytesExpectedToWrite
        ? progress.totalBytesWritten / progress.totalBytesExpectedToWrite
        : 0;
      onProgress?.(pct);
    }
  );

  const result = await download.downloadAsync();
  if (!result?.uri) {
    throw new Error('APK indirilemedi');
  }

  onProgress?.(1);
  await installApk(result.uri);
}
