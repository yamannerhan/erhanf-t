import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import type { DietMeal } from '@/lib/types';

interface MealCardProps {
  meal: DietMeal;
  onToggleEaten: () => void;
}

export function MealCard({ meal, onToggleEaten }: MealCardProps) {
  const eaten = meal.eaten === 1;

  return (
    <Pressable
      onPress={onToggleEaten}
      style={[styles.card, eaten && styles.eaten]}>
      <Image source={{ uri: meal.cropUri }} style={styles.image} contentFit="cover" />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{meal.name}</Text>
          <View style={[styles.check, eaten && styles.checkDone]}>
            <Ionicons
              name={eaten ? 'checkmark-circle' : 'ellipse-outline'}
              size={28}
              color={eaten ? theme.success : theme.textMuted}
            />
          </View>
        </View>
        <Text style={styles.time}>
          {meal.timeStart} - {meal.timeEnd}
        </Text>
        {meal.ingredients ? (
          <Text style={styles.ingredients} numberOfLines={2}>
            {meal.ingredients}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.card,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: theme.cardBorder,
    overflow: 'hidden',
    marginBottom: 12,
    flexDirection: 'row',
  },
  eaten: {
    borderColor: theme.success,
    opacity: 0.9,
  },
  image: {
    width: 100,
    height: 100,
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    color: theme.text,
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  check: {},
  checkDone: {},
  time: {
    color: theme.primary,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  ingredients: {
    color: theme.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
});
