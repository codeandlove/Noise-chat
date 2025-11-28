/**
 * TempoIndicator component - Shows real-time feedback on motion tempo
 * Part of US-004 and US-005: Calibration feedback
 */

import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TempoIndicator as TempoIndicatorType } from '../types';
import { t } from '../i18n';

interface TempoIndicatorProps {
  /** Current tempo state */
  tempo: TempoIndicatorType;
  /** Whether to show the indicator */
  visible: boolean;
}

const COLORS = {
  tooSlow: '#FF9500',
  ok: '#00FF00',
  tooFast: '#FF3B30',
  text: '#FFFFFF',
  background: 'rgba(0, 0, 0, 0.7)',
};

/**
 * Visual indicator showing whether the user's motion tempo is optimal
 */
export const TempoIndicator: React.FC<TempoIndicatorProps> = memo(({
  tempo,
  visible,
}) => {
  if (!visible) return null;

  const getIndicatorStyle = () => {
    switch (tempo) {
      case 'too-slow':
        return { backgroundColor: COLORS.tooSlow };
      case 'too-fast':
        return { backgroundColor: COLORS.tooFast };
      case 'ok':
      default:
        return { backgroundColor: COLORS.ok };
    }
  };

  const getIndicatorText = () => {
    switch (tempo) {
      case 'too-slow':
        return t('display.tooSlow');
      case 'too-fast':
        return t('display.tooFast');
      case 'ok':
      default:
        return t('display.perfect');
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.indicator, getIndicatorStyle()]}>
        <Text style={styles.text}>{getIndicatorText()}</Text>
      </View>
    </View>
  );
});

TempoIndicator.displayName = 'TempoIndicator';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 24,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  indicator: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 100,
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
});
