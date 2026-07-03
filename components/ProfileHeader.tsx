import { useCallback, useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/components/AuthProvider';
import { getProfileImage, setProfileImage } from '@/lib/profile';
import { theme } from '@/constants/theme';

export function ProfileHeader() {
  const { session, logout, isAdmin } = useAuth();
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const loadAvatar = useCallback(async () => {
    setAvatarUri(await getProfileImage());
  }, []);

  useEffect(() => {
    loadAvatar();
  }, [loadAvatar]);

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });
    if (!result.canceled && result.assets[0]) {
      await setProfileImage(result.assets[0].uri);
      setAvatarUri(result.assets[0].uri);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <View style={styles.wrap}>
      <Pressable onPress={pickAvatar} style={styles.avatarBtn} hitSlop={6}>
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={20} color={theme.textMuted} />
          </View>
        )}
      </Pressable>

      {session?.username ? (
        <Text style={styles.username} numberOfLines={1}>
          {session.username}
        </Text>
      ) : null}

      <Pressable onPress={handleLogout} style={styles.logoutBtn} hitSlop={6}>
        <Ionicons name="log-out-outline" size={16} color={theme.danger} />
        <Text style={styles.logoutText}>Oturumu Kapat</Text>
      </Pressable>

      {isAdmin && (
        <Pressable onPress={() => router.push('/admin')} hitSlop={8} style={styles.iconBtn}>
          <Ionicons name="shield-checkmark" size={22} color={theme.success} />
        </Pressable>
      )}

      <Pressable onPress={() => router.push('/settings')} hitSlop={8} style={styles.iconBtn}>
        <Ionicons name="settings-outline" size={22} color={theme.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    gap: 6,
  },
  avatarBtn: {
    marginRight: 2,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: theme.success,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  username: {
    color: theme.textMuted,
    fontSize: 11,
    fontWeight: '600',
    maxWidth: 56,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.card,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.danger + '44',
  },
  logoutText: {
    color: theme.danger,
    fontSize: 11,
    fontWeight: '700',
  },
  iconBtn: {
    padding: 4,
  },
});
