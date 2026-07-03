import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '@/constants/theme';

interface WorkoutTimerProps {
  running: boolean;
  onTick?: (seconds: number) => void;
}

function formatTime(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
}

export function WorkoutTimer({ running, onTick }: WorkoutTimerProps) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setSeconds((prev) => {
        const next = prev + 1;
        onTick?.(next);
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [running, onTick]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>SÜRE</Text>
      <Text style={styles.time}>{formatTime(seconds)}</Text>
    </View>
  );
}

export function useWorkoutTimer() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [running]);

  return {
    seconds,
    running,
    start: () => setRunning(true),
    stop: () => setRunning(false),
    reset: () => {
      setRunning(false);
      setSeconds(0);
    },
    formatted: formatTime(seconds),
  };
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  label: {
    color: theme.textMuted,
    fontSize: 12,
    letterSpacing: 3,
    fontWeight: '600',
  },
  time: {
    color: theme.text,
    fontSize: 48,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
    marginTop: 4,
  },
});
