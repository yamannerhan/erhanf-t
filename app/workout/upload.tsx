import { useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { SingleCropEditor } from '@/components/SingleCropEditor';
import { useApp } from '@/components/AppProvider';
import { theme } from '@/constants/theme';
import { getWorkoutDays, insertExercise, insertWorkoutDay } from '@/lib/database';
import { cropSingleImage, getImageSize } from '@/lib/workoutCropper';

interface DraftExercise {
  cropUri: string;
}

type Step = 'info' | 'list' | 'crop';

export default function WorkoutUploadScreen() {
  const { refresh } = useApp();
  const [step, setStep] = useState<Step>('info');
  const [title, setTitle] = useState('');
  const [muscles, setMuscles] = useState('');
  const [exercises, setExercises] = useState<DraftExercise[]>([]);
  const [imageUri, setImageUri] = useState('');
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [loading, setLoading] = useState(false);

  const nextExerciseNumber = exercises.length + 1;

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });
    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      const size = await getImageSize(uri);
      setImageUri(uri);
      setImageSize(size);
      setStep('crop');
    }
  };

  const handleCropAndAdd = async (percents: {
    left: number;
    top: number;
    width: number;
    height: number;
  }) => {
    setLoading(true);
    try {
      const cropUri = await cropSingleImage(
        imageUri,
        imageSize.width,
        imageSize.height,
        percents.left,
        percents.top,
        percents.width,
        percents.height
      );
      setExercises((prev) => [...prev, { cropUri }]);
      setImageUri('');
      setStep('list');
    } catch (e) {
      Alert.alert('Hata', 'Resim kırpılırken hata oluştu');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveExercise = (index: number) => {
    setExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveDay = async () => {
    if (!title.trim()) {
      Alert.alert('Eksik bilgi', 'Gün başlığı gerekli');
      return;
    }
    if (exercises.length === 0) {
      Alert.alert('Eksik bilgi', 'En az 1 hareket resmi eklemelisiniz');
      return;
    }
    setLoading(true);
    try {
      const days = await getWorkoutDays();
      const dayNumber = days.length + 1;
      const accentColor = theme.dayColors[(dayNumber - 1) % theme.dayColors.length];

      const dayId = await insertWorkoutDay({
        dayNumber,
        title: title.trim(),
        muscleGroups: muscles.trim() || 'Antrenman',
        imageUri: exercises[0].cropUri,
        accentColor,
      });

      for (let i = 0; i < exercises.length; i++) {
        await insertExercise({
          dayId,
          orderIndex: i,
          cropUri: exercises[i].cropUri,
          name: `Hareket ${i + 1}`,
          sets: 3,
          reps: 12,
        });
      }

      refresh();
      router.back();
    } catch (e) {
      Alert.alert('Hata', 'Kaydedilirken hata oluştu');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (step === 'info') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Yeni Antrenman Günü</Text>
        <Text style={styles.sub}>
          Gün bilgilerini girin, sonra sadece hareket resimlerini ekleyin.
        </Text>
        <Text style={styles.label}>Gün Başlığı (ör. 4. Gün)</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="4. Gün"
          placeholderTextColor={theme.textMuted}
        />
        <Text style={styles.label}>Kas Grupları</Text>
        <TextInput
          style={styles.input}
          value={muscles}
          onChangeText={setMuscles}
          placeholder="Göğüs + Triceps"
          placeholderTextColor={theme.textMuted}
        />
        <Pressable style={styles.primaryBtn} onPress={() => setStep('list')}>
          <Text style={styles.primaryBtnText}>Resimleri Eklemeye Başla</Text>
        </Pressable>
      </ScrollView>
    );
  }

  if (step === 'list') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{title || 'Yeni Gün'}</Text>
        <Text style={styles.sub}>{muscles || 'Hareket resimlerini ekleyin'}</Text>
        <Text style={styles.count}>{exercises.length} resim eklendi</Text>

        <View style={styles.grid}>
          {exercises.map((ex, i) => (
            <View key={`ex-${i}`} style={styles.imageCard}>
              <Image source={{ uri: ex.cropUri }} style={styles.thumbLarge} />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{i + 1}</Text>
              </View>
              <Pressable
                style={styles.deleteBtn}
                onPress={() => handleRemoveExercise(i)}
                hitSlop={8}>
                <Ionicons name="close-circle" size={22} color={theme.danger} />
              </Pressable>
            </View>
          ))}
        </View>

        <Pressable style={styles.addExerciseBtn} onPress={pickImage}>
          <Ionicons name="image" size={24} color={theme.success} />
          <Text style={styles.addExerciseText}>
            Hareket {nextExerciseNumber} Resmi Ekle
          </Text>
        </Pressable>

        <Pressable
          style={[styles.primaryBtn, exercises.length === 0 && styles.disabledBtn]}
          onPress={handleSaveDay}
          disabled={loading || exercises.length === 0}>
          <Text style={styles.primaryBtnText}>
            {loading ? 'Kaydediliyor...' : 'Günü Kaydet'}
          </Text>
        </Pressable>
      </ScrollView>
    );
  }

  if (step === 'crop' && imageUri) {
    return (
      <SingleCropEditor
        imageUri={imageUri}
        imageWidth={imageSize.width}
        imageHeight={imageSize.height}
        exerciseLabel={`Hareket ${nextExerciseNumber}`}
        loading={loading}
        onCancel={() => setStep('list')}
        onSave={handleCropAndAdd}
      />
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  content: { padding: 24, paddingBottom: 40 },
  title: { color: theme.text, fontSize: 22, fontWeight: '800' },
  sub: { color: theme.textMuted, marginTop: 8, marginBottom: 16, lineHeight: 22 },
  count: { color: theme.primary, fontWeight: '700', marginBottom: 16 },
  label: { color: theme.textMuted, marginTop: 12, marginBottom: 6, fontSize: 13 },
  input: {
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 14,
    color: theme.text,
    borderWidth: 1,
    borderColor: theme.cardBorder,
    fontSize: 16,
  },
  primaryBtn: {
    backgroundColor: theme.success,
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  primaryBtnText: { color: '#fff', fontSize: 17, fontWeight: '800' },
  disabledBtn: { opacity: 0.5 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  imageCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.cardBorder,
  },
  thumbLarge: { width: '100%', height: '100%' },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: theme.success,
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#fff', fontWeight: '800' },
  deleteBtn: { position: 'absolute', top: 6, right: 6 },
  addExerciseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: theme.card,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.success,
    borderStyle: 'dashed',
    marginTop: 16,
  },
  addExerciseText: { color: theme.success, fontWeight: '700', fontSize: 15, flex: 1 },
});
