import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/components/AuthProvider';
import { theme } from '@/constants/theme';

export default function LoginScreen() {
  const { login, loading: authLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password) {
      setError('Kullanıcı adı ve şifre gerekli');
      return;
    }
    setSubmitting(true);
    setError('');
    const ok = await login(username.trim(), password);
    setSubmitting(false);
    if (ok) {
      router.replace('/(tabs)');
    } else {
      setError('Hatalı kullanıcı adı veya şifre');
    }
  };

  if (authLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient colors={['#0A0A0F', '#1A1A2E']} style={StyleSheet.absoluteFill} />
      <View style={styles.content}>
        <Text style={styles.brand}>ERHAN</Text>
        <Text style={styles.brandFit}>FIT</Text>
        <Text style={styles.subtitle}>Giriş Yap</Text>

        <TextInput
          style={styles.input}
          placeholder="Kullanıcı adı"
          placeholderTextColor={theme.textMuted}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Şifre"
          placeholderTextColor={theme.textMuted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable
          style={[styles.btn, submitting && styles.btnDisabled]}
          onPress={handleLogin}
          disabled={submitting}>
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>GİRİŞ YAP</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.background },
  content: { flex: 1, justifyContent: 'center', padding: 32 },
  brand: { fontSize: 42, fontWeight: '900', color: theme.text, textAlign: 'center', letterSpacing: 6 },
  brandFit: { fontSize: 48, fontWeight: '900', color: theme.success, textAlign: 'center', letterSpacing: 8 },
  subtitle: { color: theme.textMuted, textAlign: 'center', marginTop: 8, marginBottom: 32, fontSize: 16 },
  input: {
    backgroundColor: theme.card,
    borderRadius: 14,
    padding: 16,
    color: theme.text,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.cardBorder,
  },
  error: { color: theme.danger, textAlign: 'center', marginBottom: 12 },
  btn: {
    backgroundColor: theme.success,
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  btnDisabled: { opacity: 0.7 },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '900', letterSpacing: 1 },
});
