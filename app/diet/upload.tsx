import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { CropEditor } from '@/components/CropEditor';
import { useApp } from '@/components/AppProvider';
import { theme } from '@/constants/theme';
import { clearDietMeals, insertDietMeal } from '@/lib/database';
import { cropDietImage } from '@/lib/dietCropper';
import { getImageSize } from '@/lib/workoutCropper';

const MEAL_NAMES = [
  'Kahvaltı', 'Ara Öğün 1', 'Öğle Yemeği', 'Ara Öğün 2',
  'Antrenman Öncesi', 'Antrenman Sonrası', 'Akşam Yemeği',
];

const MEAL_TIMES = [
  ['07:00', '08:00'],
  ['10:30', '11:00'],
  ['13:00', '14:00'],
  ['16:00', '16:30'],
  ['17:30', '18:00'],
  ['19:30', '20:00'],
  ['20:30', '21:00'],
];

export default function DietUploadScreen() {
  const { refresh } = useApp();
  const [step, setStep] = useState<'pick' | 'crop'>('pick');
  const [imageUri, setImageUri] = useState('');
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [loading, setLoading] = useState(false);

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

  const handleSave = async (config: { topPercent: number; heightPercent: number } | { gridLeft: number }) => {
    if ('gridLeft' in config) return;
    setLoading(true);
    try {
      const crops = await cropDietImage(
        imageUri,
        imageSize.width,
        imageSize.height,
        7,
        config.topPercent,
        config.heightPercent
      );

      await clearDietMeals();

      for (let i = 0; i < crops.length; i++) {
        await insertDietMeal({
          orderIndex: i,
          name: MEAL_NAMES[i] ?? `Öğün ${i + 1}`,
          timeStart: MEAL_TIMES[i]?.[0] ?? '12:00',
          timeEnd: MEAL_TIMES[i]?.[1] ?? '13:00',
          cropUri: crops[i],
          ingredients: '',
        });
      }

      refresh();
      router.back();
    } catch (e) {
      Alert.alert('Hata', 'Diyet resmi işlenirken hata oluştu');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (step === 'pick') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Diyet Programı Yükle</Text>
        <Text style={styles.sub}>
          Beslenme programı resmini yükle. Uygulama 7 öğüne otomatik böler.
        </Text>
        <Pressable style={styles.pickBtn} onPress={pickImage}>
          <Text style={styles.pickBtnText}>Galeriden Seç</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <CropEditor
      imageUri={imageUri}
      imageWidth={imageSize.width}
      imageHeight={imageSize.height}
      mode="diet"
      loading={loading}
      onCancel={() => router.back()}
      onSave={handleSave}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background, padding: 24 },
  title: { color: theme.text, fontSize: 22, fontWeight: '800' },
  sub: { color: theme.textMuted, marginTop: 8, marginBottom: 24, lineHeight: 22 },
  pickBtn: {
    backgroundColor: theme.warning,
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
  },
  pickBtnText: { color: '#000', fontSize: 17, fontWeight: '800' },
});
