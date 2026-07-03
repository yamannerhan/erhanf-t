import { Platform } from 'react-native';
import { Asset } from 'expo-asset';
import { theme } from '@/constants/theme';
import {
  insertDietMeal,
  insertExercise,
  insertWorkoutDay,
  isSeeded,
  markSeeded,
} from './database';
import { cropDietImage } from './dietCropper';
import { cropWorkoutImage, getImageSize } from './workoutCropper';

const DAY1_IMAGE = require('@/assets/images/day1.png');
const DAY2_IMAGE = require('@/assets/images/day2.png');
const DAY3_IMAGE = require('@/assets/images/day3.png');
const DIET_IMAGE = require('@/assets/images/diet.png');

const WORKOUT_SEED = [
  {
    dayNumber: 1,
    title: '1. Gün',
    muscleGroups: 'Göğüs + Triceps',
    image: DAY1_IMAGE,
    accentColor: theme.dayColors[0],
    exercises: [
      { name: 'Makine Chest Press', sets: 3, reps: 12 },
      { name: 'Incline Machine Press', sets: 3, reps: 12 },
      { name: 'Pec Deck', sets: 3, reps: 15 },
      { name: 'Triceps Pushdown', sets: 3, reps: 12 },
      { name: 'Rope Pushdown', sets: 3, reps: 12 },
      { name: 'Overhead Rope Extension', sets: 3, reps: 12 },
    ],
  },
  {
    dayNumber: 2,
    title: '2. Gün',
    muscleGroups: 'Sırt + Biceps',
    image: DAY2_IMAGE,
    accentColor: theme.dayColors[1],
    exercises: [
      { name: 'Lat Pulldown', sets: 3, reps: 12 },
      { name: 'Seated Cable Row', sets: 3, reps: 12 },
      { name: 'Chest Supported Row', sets: 3, reps: 12 },
      { name: 'Dumbbell Hammer Curl', sets: 3, reps: 12 },
      { name: 'Barbell Curl', sets: 3, reps: 12 },
      { name: 'Cable Curl', sets: 3, reps: 12 },
    ],
  },
  {
    dayNumber: 3,
    title: '3. Gün',
    muscleGroups: 'Omuz + Bacak',
    image: DAY3_IMAGE,
    accentColor: theme.dayColors[2],
    exercises: [
      { name: 'Machine Shoulder Press', sets: 3, reps: 12 },
      { name: 'Lateral Raise', sets: 3, reps: 15 },
      { name: 'Rear Delt Fly', sets: 3, reps: 15 },
      { name: 'Leg Press', sets: 3, reps: 12 },
      { name: 'Leg Curl', sets: 3, reps: 12 },
      { name: 'Leg Extension', sets: 3, reps: 12 },
    ],
  },
];

const DIET_SEED = [
  { name: 'Kahvaltı', timeStart: '07:00', timeEnd: '08:00', ingredients: 'Yumurta, tam buğday ekmeği, sebze, zeytin' },
  { name: 'Ara Öğün 1', timeStart: '10:30', timeEnd: '11:00', ingredients: 'Yoğurt, yulaf kepeği, badem' },
  { name: 'Öğle Yemeği', timeStart: '13:00', timeEnd: '14:00', ingredients: 'Tavuk göğsü, bulgur, salata' },
  { name: 'Ara Öğün 2', timeStart: '16:00', timeEnd: '16:30', ingredients: 'Meyve, badem' },
  { name: 'Antrenman Öncesi', timeStart: '17:30', timeEnd: '18:00', ingredients: 'Muz, yulaf' },
  { name: 'Antrenman Sonrası', timeStart: '19:30', timeEnd: '20:00', ingredients: 'Whey protein, muz' },
  { name: 'Akşam Yemeği', timeStart: '20:30', timeEnd: '21:00', ingredients: 'Balık/tavuk, salata' },
];

async function resolveAssetUri(moduleId: number): Promise<string> {
  const asset = Asset.fromModule(moduleId);
  await asset.downloadAsync();
  return asset.localUri ?? asset.uri;
}

async function safeCropWorkout(imageUri: string, width: number, height: number): Promise<string[]> {
  try {
    return await cropWorkoutImage(imageUri, width, height);
  } catch {
    return Array(6).fill(imageUri);
  }
}

async function safeCropDiet(imageUri: string, width: number, height: number): Promise<string[]> {
  try {
    return await cropDietImage(imageUri, width, height);
  } catch {
    return Array(7).fill(imageUri);
  }
}

export async function seedDatabaseIfNeeded(onProgress?: (msg: string) => void) {
  if (await isSeeded()) return;

  onProgress?.('Antrenman programı hazırlanıyor...');

  for (const day of WORKOUT_SEED) {
    const imageUri = await resolveAssetUri(day.image);
    let crops: string[];
    if (Platform.OS === 'web') {
      crops = Array(day.exercises.length).fill(imageUri);
    } else {
      const { width, height } = await getImageSize(imageUri);
      crops = await safeCropWorkout(imageUri, width, height);
    }

    const dayId = await insertWorkoutDay({
      dayNumber: day.dayNumber,
      title: day.title,
      muscleGroups: day.muscleGroups,
      imageUri,
      accentColor: day.accentColor,
    });

    for (let i = 0; i < day.exercises.length; i++) {
      const ex = day.exercises[i];
      await insertExercise({
        dayId,
        orderIndex: i,
        cropUri: crops[i],
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
      });
    }
  }

  onProgress?.('Diyet programı hazırlanıyor...');
  const dietUri = await resolveAssetUri(DIET_IMAGE);
  let mealCrops: string[];
  if (Platform.OS === 'web') {
    mealCrops = Array(DIET_SEED.length).fill(dietUri);
  } else {
    const dietSize = await getImageSize(dietUri);
    mealCrops = await safeCropDiet(dietUri, dietSize.width, dietSize.height);
  }

  for (let i = 0; i < DIET_SEED.length; i++) {
    const meal = DIET_SEED[i];
    await insertDietMeal({
      orderIndex: i,
      name: meal.name,
      timeStart: meal.timeStart,
      timeEnd: meal.timeEnd,
      cropUri: mealCrops[i],
      ingredients: meal.ingredients,
    });
  }

  await markSeeded();
  onProgress?.('Hazır!');
}
