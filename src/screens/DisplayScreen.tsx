/**
 * Display screen - POV effect with scrolling text
 * Implements US-003: Start display mode functionality
 */

import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { Countdown } from '../components';
import BrightnessService from '../services/BrightnessService';
import { t } from '../i18n';
import { APP_CONFIG, DISPLAY_CONFIG } from '../constants';

const COLORS = {
  background: '#000000',
  text: '#FFFFFF',
  accent: '#00FF00',
};

type DisplayPhase = 'countdown' | 'displaying';

interface DisplayScreenProps {
  text: string;
  brightnessAccepted: boolean;
  onStop: () => void;
}

export const DisplayScreen: React.FC<DisplayScreenProps> = ({
  text,
  brightnessAccepted,
  onStop,
}) => {
  const [phase, setPhase] = useState<DisplayPhase>('countdown');

  // Keep the screen awake during display mode
  useEffect(() => {
    activateKeepAwakeAsync().catch(() => {
      // Keep awake not available, continue silently
    });

    return () => {
      deactivateKeepAwake();
    };
  }, []);

  // Cleanup when stopping
  const handleStop = useCallback(async () => {
    // Restore brightness if it was changed
    if (brightnessAccepted) {
      await BrightnessService.restoreBrightness();
    }
    onStop();
  }, [brightnessAccepted, onStop]);

  const handleCountdownComplete = useCallback(() => {
    setPhase('displaying');
  }, []);

  // Auto-off timeout
  useEffect(() => {
    if (phase !== 'displaying') return;

    const timeout = setTimeout(() => {
      handleStop();
    }, APP_CONFIG.AUTO_OFF_TIMEOUT);

    return () => clearTimeout(timeout);
  }, [phase, handleStop]);

  // Show countdown phase
  if (phase === 'countdown') {
    return (
      <Countdown
        duration={2}
        onComplete={handleCountdownComplete}
      />
    );
  }

  // Display phase - show the text with a Stop button
  return (
    <View style={styles.container}>
      {/* Main display area with text */}
      <View style={styles.textContainer}>
        <Text style={styles.displayText} numberOfLines={1} adjustsFontSizeToFit>
          {text}
        </Text>
      </View>

      {/* Stop button */}
      <View style={styles.stopButtonContainer}>
        <TouchableOpacity
          style={styles.stopButton}
          onPress={handleStop}
          accessibilityRole="button"
          accessibilityLabel={t('display.stop')}
        >
          <Text style={styles.stopButtonText}>{t('display.stop')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: DISPLAY_CONFIG.HORIZONTAL_MARGIN_PERCENT,
  },
  displayText: {
    fontSize: DISPLAY_CONFIG.TEXT_FONT_SIZE,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    fontFamily: 'monospace',
    letterSpacing: DISPLAY_CONFIG.TEXT_LETTER_SPACING,
  },
  stopButtonContainer: {
    position: 'absolute',
    bottom: 48,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  stopButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    minWidth: 160,
    alignItems: 'center',
  },
  stopButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
});
