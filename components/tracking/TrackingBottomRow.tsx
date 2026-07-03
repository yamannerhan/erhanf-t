import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TRACKING_SCREEN } from '@/lib/trackingDefaults';

export function TrackingBottomRow({ compact = false }: { compact?: boolean }) {
  const activities = TRACKING_SCREEN.activities.slice(0, compact ? 2 : 3);
  const suggestions = TRACKING_SCREEN.suggestions.slice(0, compact ? 1 : 2);

  return (
    <View style={styles.row}>
      <View style={styles.col}>
        <Text style={styles.title}>AKTİVİTELER</Text>
        {activities.map((a) => (
          <View key={a.id} style={styles.item}>
            <View style={[styles.icon, { backgroundColor: a.color + '22' }]}>
              <Ionicons name={a.icon} size={9} color={a.color} />
            </View>
            <View style={styles.text}>
              <Text style={styles.itemTitle} numberOfLines={1}>{a.title}</Text>
              <Text style={styles.itemTime}>{a.time}</Text>
            </View>
          </View>
        ))}
      </View>
      <View style={styles.col}>
        <Text style={styles.title}>ÖNERİLER</Text>
        {suggestions.map((s) => (
          <Pressable key={s.id} style={styles.suggest}>
            <View style={[styles.icon, { backgroundColor: s.color + '22' }]}>
              <Ionicons name={s.icon} size={9} color={s.color} />
            </View>
            <View style={styles.text}>
              <Text style={styles.itemTitle} numberOfLines={1}>{s.title}</Text>
              <Text style={styles.suggestDesc} numberOfLines={1}>{s.desc}</Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flex: 1, flexDirection: 'row', gap: 4, minHeight: 0 },
  col: {
    flex: 1,
    backgroundColor: '#070B12',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 5,
    minWidth: 0,
    minHeight: 0,
  },
  title: { color: '#9CA3AF', fontSize: 6, fontWeight: '800', marginBottom: 3 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 3 },
  suggest: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 3 },
  icon: { width: 18, height: 18, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1, minWidth: 0 },
  itemTitle: { color: '#F8FAFC', fontSize: 7, fontWeight: '800' },
  itemTime: { color: '#71717A', fontSize: 5, fontWeight: '600' },
  suggestDesc: { color: '#71717A', fontSize: 5, fontWeight: '600' },
});
