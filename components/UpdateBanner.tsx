import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import {
  checkForUpdate,
  downloadAndInstallApk,
  getCurrentAppVersion,
  type ReleaseInfo,
} from '@/lib/githubUpdate';

type UpdateState =
  | 'idle'
  | 'checking'
  | 'available'
  | 'downloading'
  | 'installing'
  | 'uptodate'
  | 'no_release';

interface UpdateBannerProps {
  compact?: boolean;
  autoCheck?: boolean;
}

export function UpdateBanner({ compact = false, autoCheck = true }: UpdateBannerProps) {
  const [state, setState] = useState<UpdateState>(autoCheck ? 'checking' : 'idle');
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState(getCurrentAppVersion());
  const [latest, setLatest] = useState<ReleaseInfo | null>(null);

  const runCheck = useCallback(async () => {
    setState('checking');
    try {
      const result = await checkForUpdate();
      setCurrent(result.current);
      setLatest(result.latest);
      if (result.noReleaseYet) {
        setState('no_release');
      } else {
        setState(result.hasUpdate ? 'available' : 'uptodate');
      }
    } catch {
      setState('no_release');
    }
  }, []);

  useEffect(() => {
    if (autoCheck) runCheck();
  }, [autoCheck, runCheck]);

  const handleUpdate = async () => {
    if (!latest?.apkUrl) return;
    setState('downloading');
    setProgress(0);
    try {
      await downloadAndInstallApk(latest.apkUrl, (pct) => {
        setProgress(pct);
        if (pct >= 1) setState('installing');
      });
    } catch {
      setState('uptodate');
    }
  };

  if (state === 'checking' && compact) return null;

  if (state === 'uptodate' && compact) return null;

  if (state === 'no_release' && compact) return null;

  if (state === 'idle' && compact) return null;

  return (
    <View style={[styles.card, compact && styles.compact]}>
      <View style={styles.header}>
        <Ionicons name="cloud-download" size={22} color={theme.primary} />
        <View style={styles.headerText}>
          <Text style={styles.title}>Uygulama Güncellemesi</Text>
          <Text style={styles.version}>
            Mevcut: v{current}
            {latest ? ` → Yeni: v${latest.version}` : ''}
          </Text>
        </View>
      </View>

      {state === 'checking' && (
        <View style={styles.row}>
          <ActivityIndicator color={theme.primary} />
          <Text style={styles.statusText}>GitHub kontrol ediliyor...</Text>
        </View>
      )}

      {state === 'available' && (
        <>
          {latest?.notes ? (
            <Text style={styles.notes} numberOfLines={3}>
              {latest.notes}
            </Text>
          ) : null}
          <Pressable style={styles.updateBtn} onPress={handleUpdate}>
            <Ionicons name="download" size={20} color="#fff" />
            <Text style={styles.updateBtnText}>GÜNCELLE</Text>
          </Pressable>
          <Text style={styles.hint}>
            {Platform.OS === 'android'
              ? 'İndirilir ve kurulum ekranı otomatik açılır'
              : 'Web\'de APK indirme linki açılır'}
          </Text>
        </>
      )}

      {(state === 'downloading' || state === 'installing') && (
        <View>
          <Text style={styles.statusText}>
            {state === 'downloading'
              ? `İndiriliyor... %${Math.round(progress * 100)}`
              : 'Kurulum başlatılıyor...'}
          </Text>
          <View style={styles.barBg}>
            <View style={[styles.barFill, { width: `${Math.max(progress * 100, 5)}%` }]} />
          </View>
        </View>
      )}

      {state === 'no_release' && !compact && (
        <Text style={styles.uptodate}>Uygulamanız güncel ✓</Text>
      )}

      {state === 'uptodate' && !compact && (
        <Text style={styles.uptodate}>Uygulamanız güncel ✓</Text>
      )}

      {!compact && state !== 'checking' && (
        <Pressable style={styles.checkBtn} onPress={runCheck}>
          <Text style={styles.checkText}>Güncellemeyi Kontrol Et</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.primary + '55',
    marginBottom: 16,
  },
  compact: { marginBottom: 12 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  headerText: { flex: 1 },
  title: { color: theme.text, fontSize: 16, fontWeight: '800' },
  version: { color: theme.textMuted, fontSize: 13, marginTop: 2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statusText: { color: theme.textMuted, fontSize: 14 },
  notes: { color: theme.textMuted, fontSize: 13, marginBottom: 12, lineHeight: 18 },
  updateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.success,
    padding: 16,
    borderRadius: 14,
  },
  updateBtnText: { color: '#fff', fontSize: 17, fontWeight: '900', letterSpacing: 1 },
  hint: { color: theme.textMuted, fontSize: 11, textAlign: 'center', marginTop: 8 },
  barBg: {
    height: 8,
    backgroundColor: theme.cardBorder,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 8,
  },
  barFill: { height: '100%', backgroundColor: theme.success, borderRadius: 4 },
  uptodate: { color: theme.success, fontWeight: '600' },
  checkBtn: { marginTop: 12, alignItems: 'center' },
  checkText: { color: theme.primary, fontSize: 13, fontWeight: '600' },
});
