/**
 * CalibrationIndicator component - Shows calibration progress and feedback
 * Implements US-005: Visual feedback during tempo calibration
 */

import React, { memo, useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { t } from '../i18n';

interface CalibrationIndicatorProps {
  /** Whether calibration is in progress */
  isCalibrating: boolean;
  /** Calibration progress (0-1) */
  progress: number;
  /** Whether calibration is complete */
  isCalibrated: boolean;
  /** Whether the indicator should be visible */
  visible: boolean;
}

const COLORS = {
  background: 'rgba(0, 0, 0, 0.8)',
  progressBackground: 'rgba(255, 255, 255, 0.2)',
  progressFill: '#00FF00',
  text: '#FFFFFF',
  calibrating: '#FFCC00',
  calibrated: '#00FF00',
};

/**
 * Visual indicator showing calibration progress
 */
export const CalibrationIndicator: React.FC<CalibrationIndicatorProps> = memo(({
  isCalibrating,
  progress,
  isCalibrated,
  visible,
}) => {
  const [showComplete, setShowComplete] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Show completion animation
  useEffect(() => {
    if (isCalibrated && !showComplete) {
      setShowComplete(true);
      
      // Scale up animation for completion
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();

      // Hide after 1.5 seconds
      const hideTimeout = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setShowComplete(false);
        });
      }, 1500);

      return () => clearTimeout(hideTimeout);
    }
  }, [isCalibrated, showComplete, fadeAnim, scaleAnim]);

  // Fade in when visible
  useEffect(() => {
    if (visible && (isCalibrating || showComplete)) {
      fadeAnim.setValue(1);
    }
  }, [visible, isCalibrating, showComplete, fadeAnim]);

  if (!visible || (!isCalibrating && !showComplete)) {
    return null;
  }

  const progressWidthPercent = Math.round(progress * 100);

  return (
    <Animated.View 
      style={[
        styles.container,
        { 
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.content}>
        <Text style={styles.title}>
          {isCalibrating ? t('display.calibrating') : t('display.calibrated')}
        </Text>
        
        {isCalibrating && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBackground}>
              <View 
                style={[
                  styles.progressFill,
                  { width: `${progressWidthPercent}%` },
                ]} 
              />
            </View>
          </View>
        )}

        {showComplete && !isCalibrating && (
          <Text style={styles.checkmark}>✓</Text>
        )}
      </View>
    </Animated.View>
  );
});

CalibrationIndicator.displayName = 'CalibrationIndicator';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  content: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 200,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  progressContainer: {
    width: '100%',
    marginTop: 8,
  },
  progressBackground: {
    height: 6,
    backgroundColor: COLORS.progressBackground,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.progressFill,
    borderRadius: 3,
  },
  checkmark: {
    fontSize: 24,
    color: COLORS.calibrated,
    marginTop: 4,
  },
});
