import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { theme } from '@/constants/theme';

export interface SingleCropPercents {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface SingleCropEditorProps {
  imageUri: string;
  imageWidth: number;
  imageHeight: number;
  exerciseLabel?: string;
  onSave: (percents: SingleCropPercents) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function SingleCropEditor({
  imageUri,
  imageWidth,
  imageHeight,
  exerciseLabel,
  onSave,
  onCancel,
  loading,
}: SingleCropEditorProps) {
  const [left, setLeft] = useState(0.05);
  const [top, setTop] = useState(0.05);
  const [width, setWidth] = useState(0.9);
  const [height, setHeight] = useState(0.9);

  const previewAspect = imageWidth / imageHeight;
  const previewW = 320;
  const previewH = previewW / previewAspect;

  const overlayStyle = {
    left: left * previewW,
    top: top * previewH,
    width: width * previewW,
    height: height * previewH,
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>
        {exerciseLabel ? `${exerciseLabel} - Kırp` : 'Hareketi Kırp'}
      </Text>
      <Text style={styles.subtitle}>
        Kaydırıcılarla hareket alanını seçin
      </Text>

      <View style={[styles.preview, { width: previewW, height: previewH }]}>
        <Image
          source={{ uri: imageUri }}
          style={{ width: previewW, height: previewH }}
          resizeMode="contain"
        />
        <View style={[styles.overlay, overlayStyle]} />
      </View>

      <Text style={styles.label}>Sol: {(left * 100).toFixed(0)}%</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={0.8}
        value={left}
        onValueChange={setLeft}
        minimumTrackTintColor={theme.primary}
        maximumTrackTintColor={theme.cardBorder}
      />

      <Text style={styles.label}>Üst: {(top * 100).toFixed(0)}%</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={0.8}
        value={top}
        onValueChange={setTop}
        minimumTrackTintColor={theme.primary}
        maximumTrackTintColor={theme.cardBorder}
      />

      <Text style={styles.label}>Genişlik: {(width * 100).toFixed(0)}%</Text>
      <Slider
        style={styles.slider}
        minimumValue={0.1}
        maximumValue={1}
        value={width}
        onValueChange={setWidth}
        minimumTrackTintColor={theme.primary}
        maximumTrackTintColor={theme.cardBorder}
      />

      <Text style={styles.label}>Yükseklik: {(height * 100).toFixed(0)}%</Text>
      <Slider
        style={styles.slider}
        minimumValue={0.1}
        maximumValue={1}
        value={height}
        onValueChange={setHeight}
        minimumTrackTintColor={theme.primary}
        maximumTrackTintColor={theme.cardBorder}
      />

      <View style={styles.actions}>
        <Pressable style={styles.cancelBtn} onPress={onCancel}>
          <Text style={styles.cancelText}>İptal</Text>
        </Pressable>
        <Pressable
          style={styles.saveBtn}
          onPress={() => onSave({ left, top, width, height })}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveText}>Kaydet</Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  content: { padding: 20, paddingBottom: 40 },
  title: { color: theme.text, fontSize: 22, fontWeight: '800' },
  subtitle: { color: theme.textMuted, marginTop: 4, marginBottom: 20 },
  preview: {
    alignSelf: 'center',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: theme.cardBorder,
  },
  overlay: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: theme.success,
    backgroundColor: theme.success + '22',
  },
  label: { color: theme.textMuted, fontSize: 13, marginTop: 8 },
  slider: { width: '100%', height: 40 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 24 },
  cancelBtn: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.cardBorder,
    alignItems: 'center',
  },
  cancelText: { color: theme.textMuted, fontWeight: '700' },
  saveBtn: {
    flex: 2,
    padding: 16,
    borderRadius: 12,
    backgroundColor: theme.success,
    alignItems: 'center',
  },
  saveText: { color: '#fff', fontWeight: '800' },
});
