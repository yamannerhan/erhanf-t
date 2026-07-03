import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/components/AppProvider';
import { TabScreenShell, TabSlot } from '@/components/layout/TabScreenShell';
import { TrackingBottomRow } from '@/components/tracking/TrackingBottomRow';
import { TrackingMeasureGrid } from '@/components/tracking/TrackingMeasureGrid';
import { TrackingProgressCard } from '@/components/tracking/TrackingProgressCard';
import { TrackingWaterCard } from '@/components/tracking/TrackingWaterCard';
import { TRACKING_SCREEN } from '@/lib/trackingDefaults';
import {
  addBodyMeasurement,
  addWater,
  clearWaterForDate,
  getLatestMeasurement,
  getWaterForDate,
  removeWater,
} from '@/lib/database';

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

export default function TrackingScreen() {
  const { ready, refreshKey, refresh } = useApp();
  const insets = useSafeAreaInsets();
  const [period, setPeriod] = useState<'week' | 'month'>('week');
  const [water, setWater] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [latest, setLatest] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    const [w, l] = await Promise.all([getWaterForDate(todayStr()), getLatestMeasurement()]);
    setWater(w);
    if (l) {
      setLatest({
        weight: l.weight != null ? String(l.weight) : '0',
        waist: l.waist != null ? String(l.waist) : '0',
        shoulder: l.shoulder != null ? String(l.shoulder) : '0',
        arm: l.arm != null ? String(l.arm) : '0',
        leg: l.leg != null ? String(l.leg) : '0',
        chest: l.chest != null ? String(l.chest) : '0',
      });
    }
  }, []);

  useEffect(() => {
    if (ready) load();
  }, [ready, refreshKey, load]);

  const display = useMemo(() => {
    const out = { ...latest };
    for (const [k, v] of Object.entries(values)) {
      if (v.trim()) out[k] = v;
    }
    return out;
  }, [latest, values]);

  return (
    <TabScreenShell
      title="TAKİP"
      subtitle={TRACKING_SCREEN.subtitle}
      paddingTop={insets.top + 4}
      paddingBottom={insets.bottom + 52}>
      <TabSlot flex={24}>
        <TrackingWaterCard
          compact
          totalMl={water}
          onAdd={async (ml) => {
            await addWater(todayStr(), ml);
            setWater((w) => w + ml);
          }}
          onRemove={async (ml) => {
            await removeWater(todayStr(), ml);
            setWater(await getWaterForDate(todayStr()));
          }}
          onClear={async () => {
            await clearWaterForDate(todayStr());
            setWater(0);
          }}
        />
      </TabSlot>
      <TabSlot flex={30}>
        <TrackingMeasureGrid
          compact
          values={values}
          display={display}
          onChange={(key, val) => setValues((p) => ({ ...p, [key]: val }))}
          onSave={async () => {
            await addBodyMeasurement({
              date: todayStr(),
              weight: values.weight ? parseFloat(values.weight) : null,
              waist: values.waist ? parseFloat(values.waist) : null,
              shoulder: values.shoulder ? parseFloat(values.shoulder) : null,
              arm: values.arm ? parseFloat(values.arm) : null,
              leg: values.leg ? parseFloat(values.leg) : null,
              chest: values.chest ? parseFloat(values.chest) : null,
            });
            setValues({});
            refresh();
            load();
          }}
        />
      </TabSlot>
      <TabSlot flex={18}>
        <TrackingProgressCard compact period={period} onPeriodChange={setPeriod} />
      </TabSlot>
      <TabSlot flex={20}>
        <TrackingBottomRow compact />
      </TabSlot>
    </TabScreenShell>
  );
}
