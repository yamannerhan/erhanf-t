import {
  fetchAnnouncementsData,
  type AnnouncementsData,
} from '@/lib/githubContent';
import {
  GITHUB_ANNOUNCEMENTS_RAW_URLS,
  GITHUB_RELEASES_LIST_URL,
  getGithubHeaders,
} from '@/constants/github';

const CACHE_MS = 2 * 60 * 1000;
let cachedItems: string[] | null = null;
let cachedAt = 0;

function parseAnnouncementLines(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('#'));
}

async function fetchAnnouncementFile(): Promise<string[]> {
  for (const url of GITHUB_ANNOUNCEMENTS_RAW_URLS) {
    try {
      const response = await fetch(`${url}?t=${Date.now()}`, {
        headers: getGithubHeaders(),
      });
      if (!response.ok) continue;
      const lines = parseAnnouncementLines(await response.text());
      if (lines.length > 0) return lines;
    } catch {
      // try next branch/url
    }
  }
  return [];
}

async function fetchReleaseAnnouncements(): Promise<string[]> {
  try {
    const response = await fetch(`${GITHUB_RELEASES_LIST_URL}?per_page=5`, {
      headers: getGithubHeaders(),
    });
    if (!response.ok) return [];

    const releases = await response.json();
    if (!Array.isArray(releases)) return [];

    return releases
      .map((release: { name?: string; tag_name?: string; body?: string }) => {
        const title = release.name?.trim() || release.tag_name?.trim();
        if (!title) return null;
        const firstLine = (release.body ?? '')
          .split('\n')
          .map((line: string) => line.trim())
          .find((line: string) => line.length > 0 && !line.startsWith('#'));
        return firstLine ? `${title} — ${firstLine}` : title;
      })
      .filter((item): item is string => Boolean(item));
  } catch {
    return [];
  }
}

export async function fetchGithubAnnouncements(force = false): Promise<string[]> {
  const now = Date.now();
  if (!force && cachedItems && now - cachedAt < CACHE_MS) {
    return cachedItems;
  }

  const jsonData = await fetchAnnouncementsData();
  const fromJson = jsonData?.items?.filter(Boolean) ?? [];
  const fromFile = fromJson.length > 0 ? [] : await fetchAnnouncementFile();
  const fromReleases =
    fromJson.length > 0 || fromFile.length > 0 ? [] : await fetchReleaseAnnouncements();

  const items =
    fromJson.length > 0
      ? fromJson
      : fromFile.length > 0
        ? fromFile
        : fromReleases.length > 0
          ? fromReleases
          : ['ERHAN FIT — Duyurular GitHub üzerinden yüklenecek'];

  cachedItems = items;
  cachedAt = now;
  return items;
}

export function formatAnnouncementsTicker(items: string[]): string {
  return items.join('     ◆     ');
}

export function invalidateAnnouncementCache() {
  cachedItems = null;
  cachedAt = 0;
}

export async function loadAnnouncementsForAdmin(): Promise<AnnouncementsData> {
  const remote = await fetchAnnouncementsData(true);
  if (remote != null) {
    return remote;
  }
  const fallback = await fetchAnnouncementFile();
  return {
    items: fallback,
    updatedAt: new Date().toISOString(),
  };
}
