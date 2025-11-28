/**
 * Display screen - POV effect with scrolling text
 * Implements US-003: Start display mode functionality
 * Implements US-004: IMU synchronization for motion-synced scrolling
 * Implements US-005: Tempo calibration with haptic feedback
 */

import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { Countdown, TempoIndicator, FallbackNotice, CalibrationIndicator } from '../components';
import BrightnessService from '../services/BrightnessService';
import { useIMUMotion } from '../hooks';
import { t } from '../i18n';
import { APP_CONFIG, DISPLAY_CONFIG } from '../constants';

const COLORS = {
  background: '#000000',
  text: '#FFFFFF',
  accent: '#00FF00',
};

/**
 * Platform-specific monospace font family
 */
const MONOSPACE_FONT = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'monospace',
});

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
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
  const [showFallbackNotice, setShowFallbackNotice] = useState(false);

  // Track screen dimensions for responsive layout
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenWidth(window.width);
    });
    return () => subscription?.remove();
  }, []);

  // Handle fallback activation
  const handleFallbackActivated = useCallback(() => {
    setShowFallbackNotice(true);
    // Hide notice after 3 seconds
    setTimeout(() => setShowFallbackNotice(false), 3000);
  }, []);

  // IMU Motion hook for synchronized scrolling
  const {
    translateX,
    displayMode,
    isCalibrated,
    isCalibrating,
    calibrationProgress,
    tempoIndicator,
    permissionDenied,
    recalibrate,
  } = useIMUMotion({
    text,
    screenWidth,
    isActive: phase === 'displaying',
    onFallbackActivated: handleFallbackActivated,
  });

  // Animated style for the scrolling text
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

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

  // Display phase - show the text with IMU-synced scrolling
  return (
    <View style={styles.container}>
      {/* Calibration progress indicator */}
      <CalibrationIndicator
        isCalibrating={isCalibrating}
        progress={calibrationProgress}
        isCalibrated={isCalibrated}
        visible={displayMode === 'imu'}
      />

      {/* Tempo indicator - only show in IMU mode when calibrated */}
      <TempoIndicator
        tempo={tempoIndicator}
        visible={displayMode === 'imu' && isCalibrated && !isCalibrating}
      />

      {/* Fallback mode notice */}
      <FallbackNotice
        permissionDenied={permissionDenied}
        visible={showFallbackNotice}
      />

      {/* Main display area with animated scrolling text */}
      <View style={styles.textContainer}>
        <Animated.Text
          style={[
            styles.displayText,
            animatedStyle,
          ]}
          numberOfLines={1}
        >
          {text}
        </Animated.Text>
      </View>

      {/* Stop button and recalibrate button */}
      <View style={styles.stopButtonContainer}>
        {displayMode === 'imu' && isCalibrated && (
          <TouchableOpacity
            style={styles.recalibrateButton}
            onPress={recalibrate}
            accessibilityRole="button"
            accessibilityLabel={t('display.recalibrate')}
            accessibilityHint="Resets calibration and starts a new tempo calibration"
          >
            <Text style={styles.recalibrateButtonText}>{t('display.recalibrate')}</Text>
          </TouchableOpacity>
        )}
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
    alignItems: 'flex-start',
    width: '100%',
    overflow: 'hidden',
  },
  displayText: {
    fontSize: DISPLAY_CONFIG.TEXT_FONT_SIZE,
    fontWeight: 'bold',
    color: COLORS.text,
    fontFamily: MONOSPACE_FONT,
    letterSpacing: DISPLAY_CONFIG.TEXT_LETTER_SPACING,
    position: 'absolute',
  },
  stopButtonContainer: {
    position: 'absolute',
    bottom: 48,
    left: 0,
    right: 0,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  recalibrateButton: {
    backgroundColor: '#555555',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  recalibrateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
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
