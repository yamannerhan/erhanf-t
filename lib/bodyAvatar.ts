import type { BodyMeasurement } from '@/lib/types';
import { DASHBOARD } from './dashboardDefaults';

export interface BodyShape {
  shoulder: number;
  chest: number;
  waist: number;
  arm: number;
  leg: number;
  scale: number;
}

const DEFAULT_SHAPE: BodyShape = {
  shoulder: 1,
  chest: 1,
  waist: 1,
  arm: 1,
  leg: 1,
  scale: 1,
};

/** Ortalama erkek referans ölçüleri (cm / kg) */
const REF = {
  weight: 80,
  waist: 78,
  chest: 95,
  shoulder: 48,
  arm: 33,
  leg: 56,
} as const;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function absMul(value: number | null | undefined, ref: number, spread = 0.42): number {
  if (value == null || value <= 0) return 1;
  return clamp(value / ref, 1 - spread, 1 + spread);
}

/** Ölçü değerlerinden canlı vücut oranları */
export function measureToAbsoluteShape(m: BodyMeasurement | null): BodyShape {
  if (!m) return DEFAULT_SHAPE;
  return {
    shoulder: absMul(m.shoulder, REF.shoulder),
    chest: absMul(m.chest, REF.chest),
    waist: absMul(m.waist, REF.waist),
    arm: absMul(m.arm, REF.arm),
    leg: absMul(m.leg, REF.leg),
    scale: absMul(m.weight, REF.weight, 0.32),
  };
}

function ratio(value: number | null | undefined, base: number | null | undefined): number {
  if (value == null || base == null || base <= 0) return 1;
  return clamp(value / base, 0.68, 1.38);
}

/** İki ölçüm arasındaki değişim oranı */
export function measureToShape(
  measurement: BodyMeasurement | null,
  baseline?: BodyMeasurement | null
): BodyShape {
  if (!measurement) return DEFAULT_SHAPE;
  const base = baseline ?? measurement;
  return {
    shoulder: ratio(measurement.shoulder, base.shoulder),
    chest: ratio(measurement.chest, base.chest),
    waist: ratio(measurement.waist, base.waist),
    arm: ratio(measurement.arm, base.arm),
    leg: ratio(measurement.leg, base.leg),
    scale: ratio(measurement.weight, base.weight),
  };
}

export const DEMO_MEASUREMENT: BodyMeasurement = {
  id: 0,
  date: DASHBOARD.startDateIso,
  weight: 91,
  waist: 70,
  chest: 60,
  shoulder: 50,
  arm: 35,
  leg: 55,
};

export function formatMeasureSummary(m: BodyMeasurement | null): string {
  if (!m) return DASHBOARD.bodyStats;
  const parts: string[] = [];
  if (m.weight != null) parts.push(`${m.weight} kg`);
  if (m.waist != null) parts.push(`bel ${m.waist}`);
  if (m.chest != null) parts.push(`göğüs ${m.chest}`);
  return parts.length ? parts.join(' • ') : DASHBOARD.bodyStats;
}

export function formatMeasureDate(date: string | undefined): string {
  if (!date) return DASHBOARD.bodyDate;
  const [y, mo, d] = date.split('-');
  return `${d.padStart(2, '0')}.${mo.padStart(2, '0')}.${y}`;
}
