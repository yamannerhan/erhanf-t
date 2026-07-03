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
import type { GridCropConfig } from '@/lib/types';
import { DEFAULT_WORKOUT_GRID } from '@/lib/workoutCropper';

interface CropEditorProps {
  imageUri: string;
  imageWidth: number;
  imageHeight: number;
  mode: 'workout' | 'diet';
  onSave: (config: GridCropConfig | { topPercent: number; heightPercent: number }) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function CropEditor({
  imageUri,
  imageWidth,
  imageHeight,
  mode,
  onSave,
  onCancel,
  loading,
}: CropEditorProps) {
  const [gridLeft, setGridLeft] = useState(DEFAULT_WORKOUT_GRID.gridLeft);
  const [gridTop, setGridTop] = useState(
    mode === 'workout' ? DEFAULT_WORKOUT_GRID.gridTop : 0.22
  );
  const [gridWidth, setGridWidth] = useState(
    mode === 'workout' ? DEFAULT_WORKOUT_GRID.gridWidth : 1
  );
  const [gridHeight, setGridHeight] = useState(
    mode === 'workout' ? DEFAULT_WORKOUT_GRID.gridHeight : 0.68
  );

  const previewAspect = imageWidth / imageHeight;
  const previewW = 320;
  const previewH = previewW / previewAspect;

  const overlayStyle =
    mode === 'workout'
      ? {
          left: gridLeft * previewW,
          top: gridTop * previewH,
          width: gridWidth * previewW,
          height: gridHeight * previewH,
        }
      : {
          left: 0,
          top: gridTop * previewH,
          width: previewW,
          height: gridHeight * previewH,
        };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Kırpma Alanını Ayarla</Text>
      <Text style={styles.subtitle}>
        Kaydırıcılarla alanı düzeltin, sonra kaydedin
      </Text>

      <View style={[styles.preview, { width: previewW, height: previewH }]}>
        <Image source={{ uri: imageUri }} style={{ width: previewW, height: previewH }} resizeMode="contain" />
        <View style={[styles.overlay, overlayStyle]} />
      </View>

      {mode === 'workout' && (
        <>
          <Text style={styles.label}>Sol kenar: {(gridLeft * 100).toFixed(0)}%</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={0.5}
            value={gridLeft}
            onValueChange={setGridLeft}
            minimumTrackTintColor={theme.primary}
            maximumTrackTintColor={theme.cardBorder}
          />
          <Text style={styles.label}>Üst kenar: {(gridTop * 100).toFixed(0)}%</Text>
          <Slider
            style={styles.slider}
            minimumValue={0.1}
            maximumValue={0.4}
            value={gridTop}
            onValueChange={setGridTop}
            minimumTrackTintColor={theme.primary}
            maximumTrackTintColor={theme.cardBorder}
          />
          <Text style={styles.label}>Genişlik: {(gridWidth * 100).toFixed(0)}%</Text>
          <Slider
            style={styles.slider}
            minimumValue={0.4}
            maximumValue={0.9}
            value={gridWidth}
            onValueChange={setGridWidth}
            minimumTrackTintColor={theme.primary}
            maximumTrackTintColor={theme.cardBorder}
          />
          <Text style={styles.label}>Yükseklik: {(gridHeight * 100).toFixed(0)}%</Text>
          <Slider
            style={styles.slider}
            minimumValue={0.3}
            maximumValue={0.7}
            value={gridHeight}
            onValueChange={setGridHeight}
            minimumTrackTintColor={theme.primary}
            maximumTrackTintColor={theme.cardBorder}
          />
        </>
      )}

      {mode === 'diet' && (
        <>
          <Text style={styles.label}>Üst kenar: {(gridTop * 100).toFixed(0)}%</Text>
          <Slider
            style={styles.slider}
            minimumValue={0.1}
            maximumValue={0.35}
            value={gridTop}
            onValueChange={setGridTop}
            minimumTrackTintColor={theme.primary}
            maximumTrackTintColor={theme.cardBorder}
          />
          <Text style={styles.label}>Yükseklik: {(gridHeight * 100).toFixed(0)}%</Text>
          <Slider
            style={styles.slider}
            minimumValue={0.5}
            maximumValue={0.8}
            value={gridHeight}
            onValueChange={setGridHeight}
            minimumTrackTintColor={theme.primary}
            maximumTrackTintColor={theme.cardBorder}
          />
        </>
      )}

      <View style={styles.actions}>
        <Pressable style={styles.cancelBtn} onPress={onCancel}>
          <Text style={styles.cancelText}>İptal</Text>
        </Pressable>
        <Pressable
          style={styles.saveBtn}
          onPress={() =>
            onSave(
              mode === 'workout'
                ? { ...DEFAULT_WORKOUT_GRID, gridLeft, gridTop, gridWidth, gridHeight }
                : { topPercent: gridTop, heightPercent: gridHeight }
            )
          }
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveText}>Kaydet ve Böl</Text>
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
