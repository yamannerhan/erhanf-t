import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MEASURE_FIELDS } from '@/lib/trackingDefaults';

type MeasureValues = Record<string, string>;

interface TrackingMeasureGridProps {
  values: MeasureValues;
  display: MeasureValues;
  onChange: (key: string, val: string) => void;
  onSave: () => void;
  compact?: boolean;
}

export function TrackingMeasureGrid({ values, display, onChange, onSave, compact = false }: TrackingMeasureGridProps) {
  return (
    <View style={[styles.wrap, compact && styles.wrapCompact]}>
      <Text style={styles.title}>VÜCUT ÖLÇÜMLERİ</Text>
      <View style={styles.grid}>
        {MEASURE_FIELDS.map((field) => {
          const shown = display[field.key] || '0';
          return (
            <View key={field.key} style={styles.cell}>
              <Ionicons name={field.icon} size={10} color="#9CA3AF" />
              <Text style={styles.lbl}>{field.label}</Text>
              <Text style={styles.val}>{shown}{field.unit}</Text>
              <TextInput
                style={styles.input}
                value={values[field.key] ?? ''}
                onChangeText={(t) => onChange(field.key, t)}
                keyboardType="decimal-pad"
                placeholder="0"
                placeholderTextColor="#52525B"
              />
            </View>
          );
        })}
      </View>
      <Pressable style={styles.saveBtn} onPress={onSave}>
        <Ionicons name="save-outline" size={10} color="#E9D5FF" />
        <Text style={styles.saveText}>Kaydet</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: '#070B12',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 8,
    minHeight: 0,
  },
  wrapCompact: { padding: 6 },
  title: { color: '#9CA3AF', fontSize: 7, fontWeight: '800', marginBottom: 4 },
  grid: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 3, minHeight: 0 },
  cell: {
    width: '31%',
    flexGrow: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    padding: 4,
    alignItems: 'center',
    gap: 1,
    minWidth: 0,
  },
  lbl: { color: '#9CA3AF', fontSize: 6, fontWeight: '700' },
  val: { color: '#F8FAFC', fontSize: 8, fontWeight: '900' },
  input: {
    width: '100%',
    height: 18,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 4,
    color: '#E2E8F0',
    fontSize: 8,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 4,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(168,85,247,0.45)',
    backgroundColor: 'rgba(168,85,247,0.15)',
    flexShrink: 0,
  },
  saveText: { color: '#E9D5FF', fontSize: 8, fontWeight: '800' },
});
