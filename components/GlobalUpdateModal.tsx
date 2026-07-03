import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppLogo } from '@/components/AppLogo';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import {
  checkForUpdate,
  downloadAndInstallApk,
  getCurrentAppVersion,
  type ReleaseInfo,
} from '@/lib/githubUpdate';

interface GlobalUpdateModalProps {
  enabled?: boolean;
}

export function GlobalUpdateModal({ enabled = true }: GlobalUpdateModalProps) {
  const [visible, setVisible] = useState(false);
  const [latest, setLatest] = useState<ReleaseInfo | null>(null);
  const [current, setCurrent] = useState(getCurrentAppVersion());
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const runCheck = useCallback(async () => {
    if (!enabled) return;
    try {
      const result = await checkForUpdate();
      setCurrent(result.current);
      if (result.hasUpdate && result.latest) {
        setLatest(result.latest);
        setVisible(true);
      }
    } catch {
      // ignore
    }
  }, [enabled]);

  useEffect(() => {
    runCheck();
    const timer = setInterval(runCheck, 30 * 60 * 1000);
    return () => clearInterval(timer);
  }, [runCheck]);

  const handleUpdate = async () => {
    if (!latest?.apkUrl) return;
    setDownloading(true);
    setProgress(0);
    try {
      await downloadAndInstallApk(latest.apkUrl, (pct) => setProgress(pct));
    } catch {
      setDownloading(false);
    }
  };

  if (!visible || !latest) return null;

  return (
    <Modal transparent visible animationType="fade">
      <View style={styles.backdrop}>
        <LinearGradient colors={['#0A0A0F', '#1A1A2E']} style={styles.card}>
          <AppLogo size={80} borderRadius={16} />
          <Text style={styles.brand}>ERHAN FIT</Text>
          <View style={styles.badge}>
            <Ionicons name="cloud-download" size={16} color={theme.primary} />
            <Text style={styles.badgeText}>YENİ GÜNCELLEME</Text>
          </View>

          <Text style={styles.version}>
            v{current} → v{latest.version}
          </Text>
          {latest.notes ? (
            <Text style={styles.notes} numberOfLines={4}>
              {latest.notes}
            </Text>
          ) : null}

          {downloading ? (
            <View style={styles.progressWrap}>
              <ActivityIndicator color={theme.success} />
              <Text style={styles.progressText}>%{Math.round(progress * 100)} indiriliyor...</Text>
            </View>
          ) : (
            <Pressable style={styles.updateBtn} onPress={handleUpdate}>
              <Ionicons name="download" size={20} color="#fff" />
              <Text style={styles.updateBtnText}>GÜNCELLE</Text>
            </Pressable>
          )}

          <Pressable style={styles.laterBtn} onPress={() => setVisible(false)}>
            <Text style={styles.laterText}>Daha Sonra</Text>
          </Pressable>

          <Text style={styles.hint}>
            {Platform.OS === 'android'
              ? 'Güncelleme GitHub APK üzerinden otomatik iner'
              : 'Web önizlemede APK linki açılır'}
          </Text>
        </LinearGradient>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.primary + '55',
  },
  brand: {
    color: theme.text,
    fontSize: 22,
    fontWeight: '900',
    marginTop: 12,
    letterSpacing: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    backgroundColor: theme.primary + '22',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: theme.primary,
    fontSize: 11,
    fontWeight: '800',
  },
  version: {
    color: theme.text,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 16,
  },
  notes: {
    color: theme.textMuted,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
  },
  updateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.success,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 20,
  },
  updateBtnText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 1,
  },
  laterBtn: {
    marginTop: 14,
    padding: 8,
  },
  laterText: {
    color: theme.textMuted,
    fontWeight: '600',
  },
  hint: {
    color: theme.textMuted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 10,
  },
  progressWrap: {
    alignItems: 'center',
    marginTop: 20,
    gap: 8,
  },
  progressText: {
    color: theme.textMuted,
  },
});
