import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface ReminderConfig {
  id: string;
  title: string;
  body: string;
  hour: number;
  minute: number;
}

export const DEFAULT_MEAL_REMINDERS: ReminderConfig[] = [
  { id: 'meal-breakfast', title: 'ERHAN FIT', body: 'Kahvaltı zamanı!', hour: 7, minute: 30 },
  { id: 'meal-snack1', title: 'ERHAN FIT', body: 'Ara öğün zamanı!', hour: 10, minute: 45 },
  { id: 'meal-lunch', title: 'ERHAN FIT', body: 'Öğle yemeği zamanı!', hour: 13, minute: 30 },
  { id: 'meal-snack2', title: 'ERHAN FIT', body: 'Ara öğün zamanı!', hour: 16, minute: 15 },
  { id: 'meal-preworkout', title: 'ERHAN FIT', body: 'Antrenman öncesi öğün!', hour: 17, minute: 45 },
  { id: 'meal-postworkout', title: 'ERHAN FIT', body: 'Antrenman sonrası öğün!', hour: 19, minute: 45 },
  { id: 'meal-dinner', title: 'ERHAN FIT', body: 'Akşam yemeği zamanı!', hour: 20, minute: 45 },
];

export const DEFAULT_WATER_REMINDERS: ReminderConfig[] = [
  { id: 'water-08', title: 'ERHAN FIT', body: 'Su içme zamanı!', hour: 8, minute: 0 },
  { id: 'water-11', title: 'ERHAN FIT', body: 'Su içme zamanı!', hour: 11, minute: 0 },
  { id: 'water-13', title: 'ERHAN FIT', body: 'Su içme zamanı!', hour: 13, minute: 0 },
  { id: 'water-16', title: 'ERHAN FIT', body: 'Su içme zamanı!', hour: 16, minute: 0 },
  { id: 'water-18', title: 'ERHAN FIT', body: 'Su içme zamanı!', hour: 18, minute: 0 },
  { id: 'water-20', title: 'ERHAN FIT', body: 'Su içme zamanı!', hour: 20, minute: 0 },
  { id: 'water-22', title: 'ERHAN FIT', body: 'Su içme zamanı!', hour: 22, minute: 0 },
];

export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleDailyReminder(reminder: ReminderConfig) {
  if (Platform.OS === 'web') return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: reminder.title,
      body: reminder.body,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: reminder.hour,
      minute: reminder.minute,
    },
    identifier: reminder.id,
  });
}

export async function scheduleAllReminders(
  meals = DEFAULT_MEAL_REMINDERS,
  water = DEFAULT_WATER_REMINDERS
) {
  if (Platform.OS === 'web') return false;

  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing !== 'granted') return false;

  await Notifications.cancelAllScheduledNotificationsAsync();

  for (const reminder of [...meals, ...water]) {
    await scheduleDailyReminder(reminder);
  }

  return true;
}

export async function cancelAllReminders() {
  if (Platform.OS === 'web') return;
  await Notifications.cancelAllScheduledNotificationsAsync();
}
