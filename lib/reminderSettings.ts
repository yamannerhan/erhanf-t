import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import {
  DEFAULT_MEAL_REMINDERS,
  DEFAULT_WATER_REMINDERS,
  type ReminderConfig,
  requestNotificationPermissions,
  scheduleDailyReminder,
} from '@/lib/notifications';
import {
  fetchRemindersData,
  publishReminders,
  type ReminderItem,
  type RemindersData,
} from '@/lib/githubContent';
import type { BroadcastData } from '@/lib/githubContent';

function toConfig(item: ReminderItem): ReminderConfig {
  return {
    id: item.id,
    title: item.title,
    body: item.body,
    hour: item.hour,
    minute: item.minute,
  };
}

export function getDefaultRemindersData(): RemindersData {
  return {
    meals: DEFAULT_MEAL_REMINDERS.map((r) => ({ ...r, enabled: true })),
    water: DEFAULT_WATER_REMINDERS.map((r) => ({ ...r, enabled: true })),
    updatedAt: new Date().toISOString(),
  };
}

export async function loadRemindersFromGithub(): Promise<RemindersData> {
  const remote = await fetchRemindersData();
  if (remote?.meals?.length) return remote;
  return getDefaultRemindersData();
}

export async function applyReminders(data: RemindersData): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  const granted = await requestNotificationPermissions();
  if (!granted) return false;

  await Notifications.cancelAllScheduledNotificationsAsync();

  const active = [...data.meals, ...data.water].filter((r) => r.enabled !== false);
  for (const item of active) {
    await scheduleDailyReminder(toConfig(item));
  }

  return true;
}

export async function syncRemindersFromGithub(): Promise<RemindersData> {
  const data = await loadRemindersFromGithub();
  await applyReminders(data);
  return data;
}

export async function saveRemindersToGithub(data: RemindersData): Promise<void> {
  await publishReminders(data);
  await applyReminders(data);
}

export async function scheduleBroadcastNotification(broadcast: BroadcastData) {
  if (Platform.OS === 'web') return;

  const granted = await requestNotificationPermissions();
  if (!granted) return;

  if (broadcast.repeatDaily) {
    const date = broadcast.scheduledAt ? new Date(broadcast.scheduledAt) : new Date();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: broadcast.title,
        body: broadcast.message,
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: date.getHours(),
        minute: date.getMinutes(),
      },
      identifier: `broadcast-daily-${broadcast.id}`,
    });
    return;
  }

  const triggerDate = broadcast.scheduledAt
    ? new Date(broadcast.scheduledAt)
    : new Date(Date.now() + 2000);

  if (triggerDate.getTime() <= Date.now()) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: broadcast.title,
        body: broadcast.message,
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
      },
      identifier: `broadcast-now-${broadcast.id}`,
    });
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: broadcast.title,
      body: broadcast.message,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
    },
    identifier: `broadcast-scheduled-${broadcast.id}`,
  });
}

export function buildScheduledIso(hour: number, minute: number): string {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  if (date.getTime() <= Date.now()) {
    date.setDate(date.getDate() + 1);
  }
  return date.toISOString();
}

export function parseTimeInput(value: string): { hour: number; minute: number } | null {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
  return { hour, minute };
}

export function formatTime(hour: number, minute: number): string {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}
