import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { SingleCropEditor } from '@/components/SingleCropEditor';
import { useApp } from '@/components/AppProvider';
import { theme } from '@/constants/theme';
import { getDietMeals, insertDietMeal } from '@/lib/database';
import { cropSingleImage, getImageSize } from '@/lib/workoutCropper';

type Step = 'pick' | 'crop' | 'detail';

export default function AddMealScreen() {
  const { refresh } = useApp();
  const [step, setStep] = useState<Step>('pick');
  const [imageUri, setImageUri] = useState('');
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [cropPercents, setCropPercents] = useState({ left: 0.05, top: 0.05, width: 0.9, height: 0.9 });
  const [name, setName] = useState('');
  const [timeStart, setTimeStart] = useState('12:00');
  const [timeEnd, setTimeEnd] = useState('13:00');
  const [ingredients, setIngredients] = useState('');
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const meals = await getDietMeals();
    setName(`Öğün ${meals.length + 1}`);

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

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Eksik bilgi', 'Öğün adı gerekli');
      return;
    }
    setLoading(true);
    try {
      const cropUri = await cropSingleImage(
        imageUri,
        imageSize.width,
        imageSize.height,
        cropPercents.left,
        cropPercents.top,
        cropPercents.width,
        cropPercents.height
      );

      const meals = await getDietMeals();
      await insertDietMeal({
        orderIndex: meals.length,
        name: name.trim(),
        timeStart: timeStart.trim() || '12:00',
        timeEnd: timeEnd.trim() || '13:00',
        cropUri,
        ingredients: ingredients.trim(),
      });

      refresh();
      router.back();
    } catch (e) {
      Alert.alert('Hata', 'Öğün eklenirken hata oluştu');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (step === 'pick') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Öğün Ekle</Text>
        <Text style={styles.sub}>
          Öğün resmini seçin, kırpın ve bilgilerini girin.
        </Text>
        <Pressable style={styles.primaryBtn} onPress={pickImage}>
          <Text style={styles.primaryBtnText}>Resim Seç</Text>
        </Pressable>
      </View>
    );
  }

  if (step === 'crop' && imageUri) {
    return (
      <SingleCropEditor
        imageUri={imageUri}
        imageWidth={imageSize.width}
        imageHeight={imageSize.height}
        exerciseLabel="Öğün"
        loading={loading}
        onCancel={() => router.back()}
        onSave={(percents) => {
          setCropPercents(percents);
          setStep('detail');
        }}
      />
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>Öğün Bilgileri</Text>
      <Text style={styles.label}>Öğün Adı</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Öğle Yemeği"
        placeholderTextColor={theme.textMuted}
      />
      <View style={styles.row}>
        <View style={styles.half}>
          <Text style={styles.label}>Başlangıç</Text>
          <TextInput
            style={styles.input}
            value={timeStart}
            onChangeText={setTimeStart}
            placeholder="13:00"
            placeholderTextColor={theme.textMuted}
          />
        </View>
        <View style={styles.half}>
          <Text style={styles.label}>Bitiş</Text>
          <TextInput
            style={styles.input}
            value={timeEnd}
            onChangeText={setTimeEnd}
            placeholder="14:00"
            placeholderTextColor={theme.textMuted}
          />
        </View>
      </View>
      <Text style={styles.label}>İçerik (opsiyonel)</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={ingredients}
        onChangeText={setIngredients}
        placeholder="Tavuk, pilav, salata..."
        placeholderTextColor={theme.textMuted}
        multiline
      />
      <Pressable style={styles.primaryBtn} onPress={handleSave} disabled={loading}>
        <Text style={styles.primaryBtnText}>
          {loading ? 'Kaydediliyor...' : 'Öğünü Kaydet'}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background, padding: 24 },
  scroll: { paddingBottom: 40 },
  title: { color: theme.text, fontSize: 22, fontWeight: '800' },
  sub: { color: theme.textMuted, marginTop: 8, marginBottom: 24, lineHeight: 22 },
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
  multiline: { minHeight: 80, textAlignVertical: 'top' },
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  primaryBtn: {
    backgroundColor: theme.success,
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  primaryBtnText: { color: '#fff', fontSize: 17, fontWeight: '800' },
});
