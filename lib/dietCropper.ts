import * as ImageManipulator from 'expo-image-manipulator';
import type { CropRegion } from './types';

export const DEFAULT_DIET_ROWS = 7;

export function getDietMealRegions(
  imageWidth: number,
  imageHeight: number,
  rows: number = DEFAULT_DIET_ROWS,
  topPercent = 0.22,
  heightPercent = 0.68
): CropRegion[] {
  const startY = Math.round(imageHeight * topPercent);
  const totalH = Math.round(imageHeight * heightPercent);
  const rowH = Math.floor(totalH / rows);
  const regions: CropRegion[] = [];

  for (let i = 0; i < rows; i++) {
    regions.push({
      originX: 0,
      originY: startY + i * rowH,
      width: imageWidth,
      height: i === rows - 1 ? totalH - rowH * (rows - 1) : rowH,
    });
  }

  return regions;
}

export async function cropDietImage(
  imageUri: string,
  imageWidth: number,
  imageHeight: number,
  rows: number = DEFAULT_DIET_ROWS,
  topPercent = 0.22,
  heightPercent = 0.68
): Promise<string[]> {
  const regions = getDietMealRegions(imageWidth, imageHeight, rows, topPercent, heightPercent);
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
