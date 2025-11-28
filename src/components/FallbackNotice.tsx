/**
 * FallbackNotice component - Shows when IMU mode is unavailable
 * Part of US-004: Fallback to auto-scroll with notification
 */

import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { t } from '../i18n';

interface FallbackNoticeProps {
  /** Whether motion permission was denied */
  permissionDenied: boolean;
  /** Whether to show the notice */
  visible: boolean;
}

const COLORS = {
  background: 'rgba(255, 149, 0, 0.9)',
  text: '#FFFFFF',
};

/**
 * Notice displayed when falling back to auto-scroll mode
 */
export const FallbackNotice: React.FC<FallbackNoticeProps> = memo(({
  permissionDenied,
  visible,
}) => {
  if (!visible) return null;

  const message = permissionDenied
    ? t('errors.sensorPermissionDenied')
    : t('display.fallbackMode');

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
});

FallbackNotice.displayName = 'FallbackNotice';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 24,
    left: 16,
    right: 16,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  text: {
    fontSize: 13,
    color: COLORS.text,
    textAlign: 'center',
    fontWeight: '500',
  },
});
