import Constants from 'expo-constants';

export const GITHUB_REPO = 'yamannerhan/erhanf-t';
export const GITHUB_API_BASE = `https://api.github.com/repos/${GITHUB_REPO}`;
export const GITHUB_RELEASES_URL = `${GITHUB_API_BASE}/releases/latest`;
export const GITHUB_RELEASES_LIST_URL = `${GITHUB_API_BASE}/releases`;
export const GITHUB_ANNOUNCEMENTS_RAW_URLS = [
  `https://raw.githubusercontent.com/${GITHUB_REPO}/main/DUYURULAR.txt`,
  `https://raw.githubusercontent.com/${GITHUB_REPO}/master/DUYURULAR.txt`,
  `https://raw.githubusercontent.com/${GITHUB_REPO}/main/duyurular.txt`,
];
export const GITHUB_ANNOUNCEMENTS_JSON_URLS = [
  `https://raw.githubusercontent.com/${GITHUB_REPO}/main/announcements.json`,
  `https://raw.githubusercontent.com/${GITHUB_REPO}/master/announcements.json`,
];
export const GITHUB_BROADCAST_JSON_URLS = [
  `https://raw.githubusercontent.com/${GITHUB_REPO}/main/broadcast.json`,
  `https://raw.githubusercontent.com/${GITHUB_REPO}/master/broadcast.json`,
];
export const GITHUB_REMINDERS_JSON_URLS = [
  `https://raw.githubusercontent.com/${GITHUB_REPO}/main/reminders.json`,
  `https://raw.githubusercontent.com/${GITHUB_REPO}/master/reminders.json`,
];

export function getGithubToken(): string | undefined {
  const fromEnv = process.env.EXPO_PUBLIC_GITHUB_TOKEN?.trim();
  const fromExtra = (Constants.expoConfig?.extra?.githubToken as string | undefined)?.trim();
  return fromEnv || fromExtra || undefined;
}

export function getGithubHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'ERHAN-FIT-App',
  };
  const token = getGithubToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}
