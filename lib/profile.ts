import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const PROFILE_IMAGE_KEY = 'erhanfit_profile_image';

export async function getProfileImage(): Promise<string | null> {
  try {
    if (Platform.OS === 'web') {
      return localStorage.getItem(PROFILE_IMAGE_KEY);
    }
    return await SecureStore.getItemAsync(PROFILE_IMAGE_KEY);
  } catch {
    return null;
  }
}

export async function setProfileImage(uri: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.setItem(PROFILE_IMAGE_KEY, uri);
    return;
  }
  await SecureStore.setItemAsync(PROFILE_IMAGE_KEY, uri);
}
