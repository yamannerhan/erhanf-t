import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import type { Exercise } from '@/lib/types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ExerciseCardProps {
  exercise: Exercise;
  accentColor: string;
  active?: boolean;
  onComplete?: () => void;
}

export function ExerciseCard({
  exercise,
  accentColor,
  active = false,
  onComplete,
}: ExerciseCardProps) {
  const scale = useSharedValue(1);
  const completed = exercise.completed === 1;

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    if (completed || !onComplete) return;
    scale.value = withSpring(0.95, {}, () => {
      scale.value = withSpring(1);
    });
    onComplete();
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      style={[
        styles.card,
        animStyle,
        active && styles.active,
        completed && styles.completed,
        { borderColor: completed ? theme.success : active ? accentColor : theme.cardBorder },
      ]}>
      <View style={[styles.badge, { backgroundColor: completed ? theme.success : accentColor }]}>
        {completed ? (
          <Ionicons name="checkmark" size={18} color="#fff" />
        ) : (
          <Text style={styles.badgeText}>{exercise.orderIndex + 1}</Text>
        )}
      </View>
      <Image source={{ uri: exercise.cropUri }} style={styles.image} contentFit="cover" />
      {!completed && active && onComplete && (
        <View style={[styles.completeBtn, { backgroundColor: theme.success }]}>
          <Text style={styles.completeText}>Tamamla</Text>
        </View>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.card,
    borderRadius: 16,
    borderWidth: 2,
    overflow: 'hidden',
    marginBottom: 16,
  },
  active: {
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  completed: {
    shadowColor: theme.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
    opacity: 0.85,
  },
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  badgeText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
  image: {
    width: '100%',
    height: 220,
  },
  completeBtn: {
    margin: 16,
    marginTop: 0,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  completeText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
});
