import { Alert, Platform } from 'react-native';

export function confirmAction(
  title: string,
  message: string,
  onConfirm: () => void | Promise<void>
) {
  if (Platform.OS === 'web') {
    const ok = globalThis.confirm?.(`${title}\n\n${message}`);
    if (ok) void onConfirm();
    return;
  }

  Alert.alert(title, message, [
    { text: 'İptal', style: 'cancel' },
    { text: 'Sil', style: 'destructive', onPress: () => void onConfirm() },
  ]);
}
