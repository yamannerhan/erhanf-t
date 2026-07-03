import { useMemo } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { theme } from '@/constants/theme';
import type { BodyMeasurement } from '@/lib/types';

interface BodyChartProps {
  measurements: BodyMeasurement[];
  period: 'week' | 'month';
}

function filterByPeriod(data: BodyMeasurement[], period: 'week' | 'month') {
  const days = period === 'week' ? 7 : 30;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return data.filter((m) => new Date(m.date) >= cutoff);
}

function toChartData(values: (number | null)[], color: string) {
  return values
    .map((v, i) => (v != null ? { value: v, label: String(i + 1), dataPointColor: color } : null))
    .filter(Boolean) as { value: number; label: string; dataPointColor: string }[];
}

export function BodyChart({ measurements, period }: BodyChartProps) {
  const filtered = useMemo(
    () => filterByPeriod(measurements, period),
    [measurements, period]
  );

  const chartWidth = Dimensions.get('window').width - 64;

  if (filtered.length < 2) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>
          Grafik için en az 2 ölçüm girişi yapın
        </Text>
      </View>
    );
  }

  const weightData = toChartData(
    filtered.map((m) => m.weight),
    theme.primary
  );
  const waistData = toChartData(
    filtered.map((m) => m.waist),
    theme.success
  );

  const first = filtered[0];
  const last = filtered[filtered.length - 1];
  const weightChange =
    first.weight && last.weight
      ? (((last.weight - first.weight) / first.weight) * 100).toFixed(1)
      : null;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.container}>
        {weightChange && (
          <Text style={styles.change}>
            Kilo değişimi: {Number(weightChange) > 0 ? '+' : ''}
            {weightChange}%
          </Text>
        )}
        <Text style={styles.chartTitle}>Kilo (kg)</Text>
        <LineChart
          data={weightData}
          width={chartWidth}
          height={180}
          color={theme.primary}
          thickness={3}
          hideDataPoints={false}
          yAxisTextStyle={{ color: theme.textMuted }}
          xAxisLabelTextStyle={{ color: theme.textMuted, fontSize: 10 }}
          rulesColor={theme.cardBorder}
          backgroundColor={theme.card}
        />
        <Text style={[styles.chartTitle, { marginTop: 24 }]}>Bel (cm)</Text>
        <LineChart
          data={waistData}
          width={chartWidth}
          height={180}
          color={theme.success}
          thickness={3}
          hideDataPoints={false}
          yAxisTextStyle={{ color: theme.textMuted }}
          xAxisLabelTextStyle={{ color: theme.textMuted, fontSize: 10 }}
          rulesColor={theme.cardBorder}
          backgroundColor={theme.card}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.cardBorder,
    marginBottom: 16,
  },
  chartTitle: {
    color: theme.text,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  change: {
    color: theme.warning,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  empty: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.cardBorder,
  },
  emptyText: {
    color: theme.textMuted,
    textAlign: 'center',
  },
});
