import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BodyAvatar } from '@/components/BodyAvatar';
import {
  DEMO_MEASUREMENT,
  formatMeasureDate,
  formatMeasureSummary,
  measureToAbsoluteShape,
} from '@/lib/bodyAvatar';
import type { BodyMeasurement } from '@/lib/types';

interface BodySimulationCardProps {
  first: BodyMeasurement | null;
  latest: BodyMeasurement | null;
}

export function BodySimulationCard({ first, latest }: BodySimulationCardProps) {
  const initialM = first ?? latest ?? DEMO_MEASUREMENT;
  const currentM = latest ?? first ?? DEMO_MEASUREMENT;

  const initialShape = measureToAbsoluteShape(initialM);
  const currentShape = measureToAbsoluteShape(currentM);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          VÜCUT SİMÜLASYONU
        </Text>
        <Pressable
          style={styles.detailBtn}
          onPress={() => router.push('/(tabs)/tracking')}
          hitSlop={6}>
          <Text style={styles.detailText}>Detaylar</Text>
          <Ionicons name="chevron-forward" size={8} color="#B8BBC7" />
        </Pressable>
      </View>

      <View style={styles.columns}>
        <View style={styles.col}>
          <Text style={styles.figureLabel} numberOfLines={1}>
            İlk Halim
          </Text>
          <View style={styles.avatarSlot}>
            <BodyAvatar shape={initialShape} variant="initial" width={34} height={56} />
          </View>
          <View style={styles.metaBlock}>
            <Text style={styles.meta} numberOfLines={1}>
              {formatMeasureDate(initialM.date)}
            </Text>
            <Text style={styles.stats} numberOfLines={2}>
              {formatMeasureSummary(initialM)}
            </Text>
          </View>
        </View>

        <View style={styles.arrowCol}>
          <Pressable
            style={styles.arrowBtn}
            onPress={() => router.push('/(tabs)/tracking')}
            hitSlop={4}>
            <Ionicons name="arrow-forward" size={12} color="#C084FC" />
          </Pressable>
        </View>

        <View style={styles.col}>
          <Text style={styles.figureLabel} numberOfLines={1}>
            Son Halim
          </Text>
          <View style={styles.avatarSlot}>
            <BodyAvatar shape={currentShape} variant="current" width={34} height={56} />
          </View>
          <View style={styles.metaBlock}>
            <Text style={styles.meta} numberOfLines={1}>
              {formatMeasureDate(currentM.date)}
            </Text>
            <Text style={styles.stats} numberOfLines={2}>
              {formatMeasureSummary(currentM)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#070B12',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingTop: 7,
    paddingBottom: 7,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    minWidth: 0,
    minHeight: 0,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
    marginBottom: 3,
    flexShrink: 0,
  },
  title: {
    flex: 1,
    color: '#B8BBC7',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    minWidth: 0,
  },
  detailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    flexShrink: 0,
  },
  detailText: {
    color: '#B8BBC7',
    fontSize: 7,
    fontWeight: '600',
  },
  columns: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    minHeight: 0,
  },
  col: {
    flex: 1,
    alignItems: 'center',
    minWidth: 0,
    minHeight: 0,
    justifyContent: 'space-between',
  },
  arrowCol: {
    width: 26,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  figureLabel: {
    color: '#F4F4F5',
    fontSize: 8,
    fontWeight: '700',
    textAlign: 'center',
    flexShrink: 0,
  },
  avatarSlot: {
    width: '100%',
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0,
  },
  metaBlock: {
    width: '100%',
    flexShrink: 0,
    alignItems: 'center',
    paddingTop: 2,
  },
  meta: {
    color: '#A1A1AA',
    fontSize: 7,
    fontWeight: '500',
    textAlign: 'center',
  },
  stats: {
    color: '#A1A1AA',
    fontSize: 6,
    fontWeight: '500',
    marginTop: 1,
    textAlign: 'center',
    lineHeight: 8,
    paddingHorizontal: 1,
    width: '100%',
  },
  arrowBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#A855F7',
    backgroundColor: 'rgba(7,11,18,0.9)',
  },
});
