import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/components/AuthProvider';
import { theme } from '@/constants/theme';

export function SettingsButton() {
  const { isAdmin } = useAuth();

  return (
    <View style={{ flexDirection: 'row', marginRight: 8, gap: 4 }}>
      {isAdmin && (
        <Pressable
          onPress={() => router.push('/admin')}
          style={{ padding: 4 }}
          hitSlop={8}>
          <Ionicons name="shield-checkmark" size={24} color={theme.success} />
        </Pressable>
      )}
      <Pressable
        onPress={() => router.push('/settings')}
        style={{ padding: 4, marginRight: 8 }}
        hitSlop={8}>
        <Ionicons name="settings-outline" size={24} color={theme.text} />
      </Pressable>
    </View>
  );
}
