import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/components/AuthProvider';
import { useApp } from '@/components/AppProvider';
import { useBroadcast } from '@/components/BroadcastProvider';
import { UpdateBanner } from '@/components/UpdateBanner';
import { theme } from '@/constants/theme';
import {
  invalidateAnnouncementCache,
  loadAnnouncementsForAdmin,
} from '@/lib/githubAnnouncements';
import { publishAnnouncements, publishBroadcast } from '@/lib/githubContent';
import { getCurrentAppVersion } from '@/lib/githubUpdate';
import {
  buildScheduledIso,
  formatTime,
  getDefaultRemindersData,
  loadRemindersFromGithub,
  parseTimeInput,
  saveRemindersToGithub,
  scheduleBroadcastNotification,
} from '@/lib/reminderSettings';
import type { ReminderItem, RemindersData } from '@/lib/githubContent';
import { getAllAppUsers } from '@/lib/userDatabase';
import { applyDashboardDemoData } from '@/lib/demoData';
import type { UserRole } from '@/lib/auth';

export default function AdminScreen() {
  const { logout, addUser, session } = useAuth();
  const { refresh } = useApp();
  const { showBroadcast } = useBroadcast();
  const [newUser, setNewUser] = useState('');
  const [newPass, setNewPass] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('user');
  const [users, setUsers] = useState<{ username: string; role: UserRole }[]>([]);
  const [announcements, setAnnouncements] = useState<string[]>([]);
  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [broadcastTitle, setBroadcastTitle] = useState('ERHAN FIT');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastTime, setBroadcastTime] = useState('');
  const [repeatDaily, setRepeatDaily] = useState(false);
  const [reminders, setReminders] = useState<RemindersData>(getDefaultRemindersData());
  const [publishing, setPublishing] = useState(false);

  const loadUsers = async () => {
    setUsers(await getAllAppUsers());
  };

  const loadAnnouncements = useCallback(async () => {
    invalidateAnnouncementCache();
    const data = await loadAnnouncementsForAdmin();
    setAnnouncements(data.items);
  }, []);

  const loadReminders = useCallback(async () => {
    setReminders(await loadRemindersFromGithub());
  }, []);

  useEffect(() => {
    loadUsers();
    loadAnnouncements();
    loadReminders();
  }, [loadAnnouncements, loadReminders]);

  const handleAddUser = async () => {
    if (!newUser.trim() || !newPass) {
      Alert.alert('Hata', 'Kullanıcı adı ve şifre gerekli');
      return;
    }
    try {
      await addUser(newUser.trim(), newPass, newRole);
      setNewUser('');
      setNewPass('');
      await loadUsers();
      Alert.alert('Başarılı', 'Kullanıcı eklendi');
    } catch (e) {
      Alert.alert('Hata', e instanceof Error ? e.message : 'Eklenemedi');
    }
  };

  const handleUpdateAnnouncement = (index: number, value: string) => {
    setAnnouncements((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  const handleAddAnnouncementLine = () => {
    if (!newAnnouncement.trim()) return;
    setAnnouncements((prev) => [...prev, newAnnouncement.trim()]);
    setNewAnnouncement('');
  };

  const handleRemoveAnnouncement = (index: number) => {
    setAnnouncements((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearAnnouncements = () => {
    Alert.alert('Tümünü Sil', 'Listedeki tüm duyurular silinsin mi?', [
      { text: 'İptal', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: () => setAnnouncements([]) },
    ]);
  };

  const handlePublishAnnouncements = async () => {
    setPublishing(true);
    try {
      const saved = await publishAnnouncements(announcements);
      setAnnouncements(saved.items);
      invalidateAnnouncementCache();
      Alert.alert(
        'Başarılı',
        saved.items.length
          ? `${saved.items.length} duyuru GitHub'a kaydedildi.`
          : 'Duyurular temizlendi ve GitHub\'a kaydedildi.'
      );
    } catch (e) {
      Alert.alert('Hata', e instanceof Error ? e.message : 'Gönderilemedi');
    } finally {
      setPublishing(false);
    }
  };

  const handleSendBroadcast = async () => {
    if (!broadcastMessage.trim()) {
      Alert.alert('Hata', 'Bildirim mesajı gerekli');
      return;
    }
    setPublishing(true);
    try {
      let scheduledAt: string | undefined;
      if (broadcastTime.trim()) {
        const parsed = parseTimeInput(broadcastTime);
        if (!parsed) {
          Alert.alert('Hata', 'Saat formatı HH:MM olmalı (ör. 14:30)');
          setPublishing(false);
          return;
        }
        scheduledAt = buildScheduledIso(parsed.hour, parsed.minute);
      }

      const payload = await publishBroadcast(broadcastTitle, broadcastMessage, {
        scheduledAt,
        repeatDaily,
      });

      await scheduleBroadcastNotification(payload);
      showBroadcast(payload);

      setBroadcastMessage('');
      Alert.alert(
        'Başarılı',
        repeatDaily
          ? 'Günlük tekrarlayan bildirim ayarlandı. Sizin telefonunuza da gösterildi.'
          : scheduledAt
            ? 'Zamanlı bildirim ayarlandı. Saatinde tüm telefonlara gidecek.'
            : 'Bildirim gönderildi. Sizin telefonunuza da gösterildi.'
      );
    } catch (e) {
      Alert.alert('Hata', e instanceof Error ? e.message : 'Gönderilemedi');
    } finally {
      setPublishing(false);
    }
  };

  const updateReminderTime = (
    group: 'meals' | 'water',
    index: number,
    timeValue: string
  ) => {
    const parsed = parseTimeInput(timeValue);
    if (!parsed && timeValue.trim() !== '') return;
    setReminders((prev) => {
      const list = [...prev[group]];
      const item = { ...list[index] };
      if (parsed) {
        item.hour = parsed.hour;
        item.minute = parsed.minute;
      }
      list[index] = item;
      return { ...prev, [group]: list };
    });
  };

  const toggleReminder = (group: 'meals' | 'water', index: number, enabled: boolean) => {
    setReminders((prev) => {
      const list = [...prev[group]];
      list[index] = { ...list[index], enabled };
      return { ...prev, [group]: list };
    });
  };

  const handleSaveReminders = async () => {
    setPublishing(true);
    try {
      await saveRemindersToGithub(reminders);
      Alert.alert('Başarılı', 'Hatırlatma saatleri GitHub\'a kaydedildi. Tüm telefonlar çekecek.');
    } catch (e) {
      Alert.alert('Hata', e instanceof Error ? e.message : 'Kaydedilemedi');
    } finally {
      setPublishing(false);
    }
  };

  const renderReminderGroup = (title: string, group: 'meals' | 'water', items: ReminderItem[]) => (
    <>
      <Text style={styles.subSection}>{title}</Text>
      {items.map((item, index) => (
        <View key={item.id} style={styles.reminderRow}>
          <View style={styles.reminderInfo}>
            <Text style={styles.reminderName}>{item.body}</Text>
            <TextInput
              style={styles.timeInput}
              value={formatTime(item.hour, item.minute)}
              onChangeText={(v) => updateReminderTime(group, index, v)}
              placeholder="HH:MM"
              placeholderTextColor={theme.textMuted}
            />
          </View>
          <Switch
            value={item.enabled !== false}
            onValueChange={(v) => toggleReminder(group, index, v)}
            trackColor={{ true: theme.success, false: theme.cardBorder }}
          />
        </View>
      ))}
    </>
  );

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const handleResetDemoData = () => {
    Alert.alert(
      'Demo Verileri',
      'Tüm ölçümler, su kayıtları ve ilerleme sıfırlanıp görseldeki demo veriler yüklenecek. Emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sıfırla ve Yükle',
          style: 'destructive',
          onPress: async () => {
            setPublishing(true);
            try {
              await applyDashboardDemoData();
              refresh();
              Alert.alert('Başarılı', 'Ana sayfa demo verileri yüklendi.');
            } catch (e) {
              Alert.alert('Hata', e instanceof Error ? e.message : 'Yüklenemedi');
            } finally {
              setPublishing(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Ionicons name="shield-checkmark" size={40} color={theme.success} />
        <Text style={styles.heroTitle}>Admin Paneli</Text>
        <Text style={styles.heroSub}>Hoş geldin, {session?.username}</Text>
        <Text style={styles.version}>Sürüm: v{getCurrentAppVersion()}</Text>
      </View>

      <UpdateBanner autoCheck />

      <Text style={styles.section}>ANA SAYFA DEMO VERİLERİ</Text>
      <Text style={styles.help}>
        Ölçümler, su, antrenman ilerlemesi ve istatistikleri sıfırlayıp referans görseldeki
        değerleri yükler (91 kg, 70 cm, 3. Gün, 12 seri, 1.8L su…).
      </Text>
      <Pressable
        style={[styles.primaryBtn, publishing && styles.disabled]}
        onPress={handleResetDemoData}
        disabled={publishing}>
        {publishing ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryBtnText}>Sıfırla ve Demo Yükle</Text>
        )}
      </Pressable>

      <Text style={styles.section}>KAYAN DUYURU (TEK SATIR)</Text>
      <Text style={styles.help}>
        Duyurular tek kayan yazıda birleşir. Düzenleyin, silin ve GitHub'a kaydedin.
      </Text>

      <Pressable style={styles.refreshBtn} onPress={loadAnnouncements}>
        <Ionicons name="refresh" size={16} color={theme.primary} />
        <Text style={styles.refreshText}>GitHub'dan Yenile</Text>
      </Pressable>

      {announcements.map((item, index) => (
        <View key={`ann-${index}`} style={styles.announceRow}>
          <TextInput
            style={styles.announceInput}
            value={item}
            onChangeText={(v) => handleUpdateAnnouncement(index, v)}
            multiline
          />
          <Pressable onPress={() => handleRemoveAnnouncement(index)} hitSlop={8}>
            <Ionicons name="trash-outline" size={22} color={theme.danger} />
          </Pressable>
        </View>
      ))}

      <TextInput
        style={styles.input}
        placeholder="Yeni duyuru ekle..."
        placeholderTextColor={theme.textMuted}
        value={newAnnouncement}
        onChangeText={setNewAnnouncement}
      />
      <View style={styles.rowBtns}>
        <Pressable style={styles.secondaryBtn} onPress={handleAddAnnouncementLine}>
          <Text style={styles.secondaryBtnText}>Ekle</Text>
        </Pressable>
        <Pressable style={styles.secondaryBtn} onPress={handleClearAnnouncements}>
          <Text style={[styles.secondaryBtnText, { color: theme.danger }]}>Tümünü Sil</Text>
        </Pressable>
      </View>
      <Pressable
        style={[styles.primaryBtn, publishing && styles.disabled]}
        onPress={handlePublishAnnouncements}
        disabled={publishing}>
        {publishing ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryBtnText}>Kaydet ve GitHub'a Yayınla</Text>
        )}
      </Pressable>

      <Text style={styles.section}>HERKESE BİLDİRİM</Text>
      <TextInput
        style={styles.input}
        placeholder="Başlık"
        placeholderTextColor={theme.textMuted}
        value={broadcastTitle}
        onChangeText={setBroadcastTitle}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Bildirim mesajı..."
        placeholderTextColor={theme.textMuted}
        value={broadcastMessage}
        onChangeText={setBroadcastMessage}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Saat (boş = hemen) örn: 14:30"
        placeholderTextColor={theme.textMuted}
        value={broadcastTime}
        onChangeText={setBroadcastTime}
      />
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Her gün tekrarla</Text>
        <Switch
          value={repeatDaily}
          onValueChange={setRepeatDaily}
          trackColor={{ true: theme.success, false: theme.cardBorder }}
        />
      </View>
      <Pressable
        style={[styles.broadcastBtn, publishing && styles.disabled]}
        onPress={handleSendBroadcast}
        disabled={publishing}>
        <Ionicons name="notifications" size={20} color="#111" />
        <Text style={styles.broadcastBtnText}>Gönder (kendi telefonuna da gelir)</Text>
      </Pressable>

      <Text style={styles.section}>DİYET & SU HATIRLATMALARI</Text>
      <Text style={styles.help}>Saatleri düzenleyin. GitHub'a kaydedince tüm telefonlar günceller.</Text>
      {renderReminderGroup('Öğünler', 'meals', reminders.meals)}
      {renderReminderGroup('Su', 'water', reminders.water)}
      <Pressable
        style={[styles.primaryBtn, publishing && styles.disabled]}
        onPress={handleSaveReminders}
        disabled={publishing}>
        <Text style={styles.primaryBtnText}>Hatırlatmaları Kaydet</Text>
      </Pressable>

      <Text style={styles.section}>KULLANICI EKLE</Text>
      <TextInput
        style={styles.input}
        placeholder="Kullanıcı adı"
        placeholderTextColor={theme.textMuted}
        value={newUser}
        onChangeText={setNewUser}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        placeholderTextColor={theme.textMuted}
        value={newPass}
        onChangeText={setNewPass}
        secureTextEntry
      />
      <View style={styles.roleRow}>
        {(['user', 'admin'] as UserRole[]).map((r) => (
          <Pressable
            key={r}
            style={[styles.roleBtn, newRole === r && styles.roleActive]}
            onPress={() => setNewRole(r)}>
            <Text style={[styles.roleText, newRole === r && styles.roleTextActive]}>
              {r === 'admin' ? 'Admin' : 'Kullanıcı'}
            </Text>
          </Pressable>
        ))}
      </View>
      <Pressable style={styles.addBtn} onPress={handleAddUser}>
        <Text style={styles.addBtnText}>Kullanıcı Ekle</Text>
      </Pressable>

      {users.length > 0 && (
        <>
          <Text style={styles.section}>KAYITLI KULLANICILAR</Text>
          {users.map((u) => (
            <View key={u.username} style={styles.userRow}>
              <Text style={styles.userName}>{u.username}</Text>
              <Text style={styles.userRole}>{u.role}</Text>
            </View>
          ))}
        </>
      )}

      <Pressable style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color={theme.danger} />
        <Text style={styles.logoutText}>Çıkış Yap</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  content: { padding: 20, paddingBottom: 40 },
  hero: { alignItems: 'center', marginBottom: 20 },
  heroTitle: { color: theme.text, fontSize: 24, fontWeight: '900', marginTop: 8 },
  heroSub: { color: theme.textMuted, marginTop: 4 },
  version: { color: theme.primary, marginTop: 4, fontWeight: '600' },
  section: {
    color: theme.textMuted,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    marginTop: 20,
    marginBottom: 10,
  },
  subSection: {
    color: theme.text,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 6,
  },
  help: {
    color: theme.textMuted,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 10,
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  refreshText: { color: theme.primary, fontWeight: '600' },
  input: {
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 14,
    color: theme.text,
    borderWidth: 1,
    borderColor: theme.cardBorder,
    marginBottom: 10,
  },
  textArea: { minHeight: 90, textAlignVertical: 'top' },
  announceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: theme.card,
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.cardBorder,
  },
  announceInput: {
    flex: 1,
    color: theme.text,
    fontSize: 14,
    minHeight: 40,
    padding: 0,
  },
  rowBtns: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  secondaryBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.cardBorder,
    alignItems: 'center',
  },
  secondaryBtnText: { color: theme.text, fontWeight: '700' },
  primaryBtn: {
    backgroundColor: theme.primary,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  primaryBtnText: { color: '#fff', fontWeight: '800' },
  broadcastBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.warning,
    padding: 16,
    borderRadius: 12,
  },
  broadcastBtnText: { color: '#111', fontWeight: '900', fontSize: 14 },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  switchLabel: { color: theme.text, fontWeight: '600' },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.card,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.cardBorder,
  },
  reminderInfo: { flex: 1, marginRight: 10 },
  reminderName: { color: theme.text, fontSize: 13, marginBottom: 6 },
  timeInput: {
    backgroundColor: theme.background,
    borderRadius: 8,
    padding: 8,
    color: theme.text,
    borderWidth: 1,
    borderColor: theme.cardBorder,
    width: 90,
    fontWeight: '700',
  },
  roleRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  roleBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.cardBorder,
    alignItems: 'center',
  },
  roleActive: { backgroundColor: theme.primary, borderColor: theme.primary },
  roleText: { color: theme.textMuted, fontWeight: '600' },
  roleTextActive: { color: '#fff' },
  addBtn: {
    backgroundColor: theme.primary,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  addBtnText: { color: '#fff', fontWeight: '800' },
  userRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.card,
    padding: 12,
    borderRadius: 10,
    marginBottom: 6,
  },
  userName: { color: theme.text, fontWeight: '600' },
  userRole: { color: theme.textMuted, textTransform: 'capitalize' },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 32,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.danger + '55',
  },
  logoutText: { color: theme.danger, fontWeight: '700' },
  disabled: { opacity: 0.6 },
});
