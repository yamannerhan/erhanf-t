import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

interface WaterTrackerProps {
  totalMl: number;
  onAdd: (ml: number) => void;
  onRemove?: (ml: number) => void;
  onClear?: () => void;
}

export function WaterTracker({ totalMl, onAdd, onRemove, onClear }: WaterTrackerProps) {
  const liters = (totalMl / 1000).toFixed(1);
  const goalLiters = (theme.waterGoalMl / 1000).toFixed(1);
  const progress = Math.min(totalMl / theme.waterGoalMl, 1);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Su Takibi</Text>
        <Text style={styles.amount}>
          {liters} / {goalLiters} L
        </Text>
      </View>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${progress * 100}%` }]} />
      </View>

      <Text style={styles.subLabel}>Ekle</Text>
      <View style={styles.buttons}>
        {[250, 500, 750].map((ml) => (
          <Pressable key={`add-${ml}`} style={styles.addBtn} onPress={() => onAdd(ml)}>
            <Text style={styles.addBtnText}>+{ml} ml</Text>
          </Pressable>
        ))}
      </View>

      {onRemove && (
        <>
          <Text style={styles.subLabel}>Sil</Text>
          <View style={styles.buttons}>
            {[250, 500, 750].map((ml) => (
              <Pressable
                key={`remove-${ml}`}
                style={[styles.removeBtn, totalMl < ml && styles.disabledBtn]}
                onPress={() => totalMl > 0 && onRemove(ml)}
                disabled={totalMl <= 0}>
                <Text style={styles.removeBtnText}>-{ml} ml</Text>
              </Pressable>
            ))}
          </View>
        </>
      )}

      {onClear && totalMl > 0 && (
        <Pressable style={styles.clearBtn} onPress={onClear}>
          <Ionicons name="trash-outline" size={16} color={theme.danger} />
          <Text style={styles.clearBtnText}>Bugünkü suyu sıfırla</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(16, 20, 38, 0.85)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(47, 128, 255, 0.3)',
    shadowColor: theme.glow.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    color: theme.text,
    fontSize: 18,
    fontWeight: '700',
  },
  amount: {
    color: theme.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  subLabel: {
    color: theme.textMuted,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 4,
  },
  barBg: {
    height: 12,
    backgroundColor: theme.cardBorder,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 12,
  },
  barFill: {
    height: '100%',
    backgroundColor: theme.blue,
    borderRadius: 6,
  },
  buttons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  addBtn: {
    flex: 1,
    backgroundColor: 'rgba(47,128,255,0.15)',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.blue,
  },
  addBtnText: {
    color: theme.blue,
    fontWeight: '700',
    fontSize: 14,
  },
  removeBtn: {
    flex: 1,
    backgroundColor: theme.danger + '22',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.danger + '88',
  },
  removeBtnText: {
    color: theme.danger,
    fontWeight: '700',
    fontSize: 14,
  },
  disabledBtn: {
    opacity: 0.4,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10,
    paddingVertical: 10,
  },
  clearBtnText: {
    color: theme.danger,
    fontWeight: '700',
    fontSize: 13,
  },
});
