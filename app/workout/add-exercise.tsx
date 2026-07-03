import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { SingleCropEditor } from '@/components/SingleCropEditor';
import { useApp } from '@/components/AppProvider';
import { theme } from '@/constants/theme';
import { getExercises, insertExercise } from '@/lib/database';
import { cropSingleImage, getImageSize } from '@/lib/workoutCropper';

type Step = 'pick' | 'crop';

export default function AddExerciseScreen() {
  const { dayId } = useLocalSearchParams<{ dayId: string }>();
  const { refresh } = useApp();
  const [step, setStep] = useState<Step>('pick');
  const [imageUri, setImageUri] = useState('');
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [loading, setLoading] = useState(false);
  const [orderIndex, setOrderIndex] = useState(0);

  const pickImage = async () => {
    const existing = await getExercises(Number(dayId));
    setOrderIndex(existing.length);

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

  const handleCropAndSave = async (percents: {
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

      await insertExercise({
        dayId: Number(dayId),
        orderIndex,
        cropUri,
        name: `Hareket ${orderIndex + 1}`,
        sets: 3,
        reps: 12,
      });

      refresh();
      router.back();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (step === 'pick') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Hareket Resmi Ekle</Text>
        <Text style={styles.sub}>
          Sadece hareket resmini seçin ve kırpın. İsim girmenize gerek yok.
        </Text>
        <Pressable style={styles.primaryBtn} onPress={pickImage}>
          <Text style={styles.primaryBtnText}>Resim Seç</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SingleCropEditor
      imageUri={imageUri}
      imageWidth={imageSize.width}
      imageHeight={imageSize.height}
      exerciseLabel={`Hareket ${orderIndex + 1}`}
      loading={loading}
      onCancel={() => router.back()}
      onSave={handleCropAndSave}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background, padding: 24 },
  title: { color: theme.text, fontSize: 22, fontWeight: '800' },
  sub: { color: theme.textMuted, marginTop: 8, marginBottom: 24, lineHeight: 22 },
  primaryBtn: {
    backgroundColor: theme.success,
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#fff', fontSize: 17, fontWeight: '800' },
});
