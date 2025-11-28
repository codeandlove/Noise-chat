/**
 * Countdown component for display mode start
 * Shows a countdown from the specified number before starting display
 */

import React, { memo, useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { t } from '../i18n';

const COLORS = {
  background: '#000000',
  text: '#FFFFFF',
  accent: '#00FF00',
};

interface CountdownProps {
  duration: number; // countdown duration in seconds (1-3)
  onComplete: () => void;
  onCancel?: () => void;
}

export const Countdown: React.FC<CountdownProps> = memo(({
  duration,
  onComplete,
}) => {
  const [count, setCount] = useState(duration);

  const triggerHaptic = useCallback(async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // Haptics not available, continue silently
    }
  }, []);

  useEffect(() => {
    // Initial haptic
    triggerHaptic();

    const interval = setInterval(() => {
      setCount((prev) => {
        const next = prev - 1;
        if (next > 0) {
          triggerHaptic();
        } else if (next === 0) {
          // Final haptic before completing
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [triggerHaptic]);

  useEffect(() => {
    if (count === 0) {
      // Small delay to ensure the "0" or "GO" is visible
      const timeout = setTimeout(() => {
        onComplete();
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [count, onComplete]);

  return (
    <View style={styles.container}>
      <View style={styles.countdownCircle}>
        <Text style={styles.countdownText}>
          {count > 0 ? t('display.countdown', { count }) : '→'}
        </Text>
      </View>
    </View>
  );
});

Countdown.displayName = 'Countdown';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  countdownCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 4,
    borderColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: COLORS.accent,
  },
});
