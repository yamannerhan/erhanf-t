export interface WorkoutDay {
  id: number;
  dayNumber: number;
  title: string;
  muscleGroups: string;
  imageUri: string;
  accentColor: string;
}

export interface Exercise {
  id: number;
  dayId: number;
  orderIndex: number;
  cropUri: string;
  name: string;
  sets: number;
  reps: number;
  completed: number;
}

export interface DietMeal {
  id: number;
  orderIndex: number;
  name: string;
  timeStart: string;
  timeEnd: string;
  cropUri: string;
  ingredients: string;
  eaten: number;
}

export interface WaterLog {
  id: number;
  date: string;
  amountMl: number;
}

export interface BodyMeasurement {
  id: number;
  date: string;
  weight: number | null;
  waist: number | null;
  shoulder: number | null;
  arm: number | null;
  leg: number | null;
  chest: number | null;
}

export interface WorkoutSession {
  id: number;
  dayId: number;
  startedAt: string;
  endedAt: string | null;
  durationSec: number;
}

export interface CropRegion {
  originX: number;
  originY: number;
  width: number;
  height: number;
}

export interface GridCropConfig {
  gridLeft: number;
  gridTop: number;
  gridWidth: number;
  gridHeight: number;
  rows: number;
  cols: number;
}
