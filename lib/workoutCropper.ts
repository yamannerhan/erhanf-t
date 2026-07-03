import * as ImageManipulator from 'expo-image-manipulator';
import type { CropRegion, GridCropConfig } from './types';

export const DEFAULT_WORKOUT_GRID: GridCropConfig = {
  gridLeft: 0.34,
  gridTop: 0.18,
  gridWidth: 0.62,
  gridHeight: 0.54,
  rows: 2,
  cols: 3,
};

export function getWorkoutCellRegions(
  imageWidth: number,
  imageHeight: number,
  config: GridCropConfig = DEFAULT_WORKOUT_GRID
): CropRegion[] {
  const gridX = Math.round(imageWidth * config.gridLeft);
  const gridY = Math.round(imageHeight * config.gridTop);
  const gridW = Math.round(imageWidth * config.gridWidth);
  const gridH = Math.round(imageHeight * config.gridHeight);
  const cellW = Math.floor(gridW / config.cols);
  const cellH = Math.floor(gridH / config.rows);
  const regions: CropRegion[] = [];

  for (let row = 0; row < config.rows; row++) {
    for (let col = 0; col < config.cols; col++) {
      regions.push({
        originX: gridX + col * cellW,
        originY: gridY + row * cellH,
        width: col === config.cols - 1 ? gridW - cellW * (config.cols - 1) : cellW,
        height: row === config.rows - 1 ? gridH - cellH * (config.rows - 1) : cellH,
      });
    }
  }

  return regions;
}

export async function cropWorkoutImage(
  imageUri: string,
  imageWidth: number,
  imageHeight: number,
  config: GridCropConfig = DEFAULT_WORKOUT_GRID
): Promise<string[]> {
  const regions = getWorkoutCellRegions(imageWidth, imageHeight, config);
  const results: string[] = [];

  for (const region of regions) {
    const result = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ crop: region }],
      { compress: 0.85, format: ImageManipulator.SaveFormat.JPEG }
    );
    results.push(result.uri);
  }

  return results;
}

export async function cropSingleImage(
  imageUri: string,
  imageWidth: number,
  imageHeight: number,
  left: number,
  top: number,
  width: number,
  height: number
): Promise<string> {
  const region: CropRegion = {
    originX: Math.round(imageWidth * left),
    originY: Math.round(imageHeight * top),
    width: Math.round(imageWidth * width),
    height: Math.round(imageHeight * height),
  };

  const result = await ImageManipulator.manipulateAsync(
    imageUri,
    [{ crop: region }],
    { compress: 0.85, format: ImageManipulator.SaveFormat.JPEG }
  );
  return result.uri;
}

export async function getImageSize(uri: string): Promise<{ width: number; height: number }> {
  const { Image } = await import('react-native');
  return new Promise((resolve, reject) => {
    Image.getSize(uri, (width, height) => resolve({ width, height }), reject);
  });
}
