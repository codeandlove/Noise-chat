/**
 * Custom hook for IMU-synchronized motion control
 * Implements US-004: Motion sensor synchronization for POV effect
 * Implements US-005: Tempo calibration with haptic feedback
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import {
  useSharedValue,
  withSpring,
  cancelAnimation,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import MotionService, { IMUState } from '../services/MotionService';
import CalibrationService, { CalibrationState } from '../services/CalibrationService';
import { DisplayMode, TempoIndicator, MotionData } from '../types';

interface UseIMUMotionParams {
  /** Text to display */
  text: string;
  /** Screen width for calculating scroll distance */
  screenWidth: number;
  /** Whether the effect is active */
  isActive: boolean;
  /** Called when fallback mode is activated due to unavailable/denied sensors */
  onFallbackActivated?: () => void;
}

interface UseIMUMotionReturn {
  /** Animated translateX value for text position */
  translateX: SharedValue<number>;
  /** Current display mode ('imu' or 'auto-scroll') */
  displayMode: DisplayMode;
  /** Whether calibration is complete */
  isCalibrated: boolean;
  /** Whether calibration is in progress */
  isCalibrating: boolean;
  /** Calibration progress (0-1) */
  calibrationProgress: number;
  /** Tempo indicator for UI feedback */
  tempoIndicator: TempoIndicator;
  /** Current scroll direction */
  direction: 'left' | 'right' | 'stationary';
  /** Whether IMU is available */
  isIMUAvailable: boolean;
  /** Force recalibration */
  recalibrate: () => void;
  /** Whether permission was denied */
  permissionDenied: boolean;
  /** Whether haptic metronome is enabled */
  metronomeEnabled: boolean;
  /** Toggle haptic metronome */
  setMetronomeEnabled: (enabled: boolean) => void;
}

/**
 * Constants for scroll calculations
 * Character width is an estimate for monospace font at ~28px display size.
 * This provides a reasonable approximation across platforms.
 * Matches the constant in useScrollAnimation for consistency.
 */
const CHAR_WIDTH = 20; // px per character (monospace font estimate)
const BASE_SCROLL_MULTIPLIER = 15; // Convert velocity to scroll pixels

/**
 * Hook for managing IMU-synchronized scrolling animation
 * Provides fallback to auto-scroll when sensors are unavailable
 */
export const useIMUMotion = ({
  text,
  screenWidth,
  isActive,
  onFallbackActivated,
}: UseIMUMotionParams): UseIMUMotionReturn => {
  const [displayMode, setDisplayMode] = useState<DisplayMode>('imu');
  const [isCalibrated, setIsCalibrated] = useState(false);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibrationProgress, setCalibrationProgress] = useState(0);
  const [tempoIndicator, setTempoIndicator] = useState<TempoIndicator>('too-slow');
  const [direction, setDirection] = useState<'left' | 'right' | 'stationary'>('stationary');
  const [isIMUAvailable, setIsIMUAvailable] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [metronomeEnabled, setMetronomeEnabledState] = useState(true);
  
  // Animation values
  const translateX = useSharedValue(screenWidth);
  const textWidth = text.length * CHAR_WIDTH;
  const autoScrollActive = useRef(false);
  const lastTempoRef = useRef<TempoIndicator>('too-slow');
  
  // Handle calibration state updates
  const handleCalibrationStateUpdate = useCallback((state: CalibrationState) => {
    setIsCalibrating(state.isCalibrating);
    setIsCalibrated(state.isCalibrated);
    setCalibrationProgress(state.progress);
    setTempoIndicator(state.tempoIndicator);
    setMetronomeEnabledState(state.metronomeEnabled);
    
    // Play haptic feedback on tempo change
    if (state.tempoIndicator !== lastTempoRef.current && state.isCalibrated) {
      CalibrationService.playTempoHaptic(state.tempoIndicator);
      lastTempoRef.current = state.tempoIndicator;
    }
  }, []);
  
  // Initialize IMU on mount
  useEffect(() => {
    if (!isActive) return;
    
    const initIMU = async () => {
      const { available, permitted } = await MotionService.initialize();
      
      if (!available) {
        // Sensors not available - use fallback
        setIsIMUAvailable(false);
        setDisplayMode('auto-scroll');
        onFallbackActivated?.();
        return;
      }
      
      if (!permitted) {
        // Permission denied - use fallback
        setPermissionDenied(true);
        setDisplayMode('auto-scroll');
        onFallbackActivated?.();
        return;
      }
      
      // IMU is ready - start calibration
      setIsIMUAvailable(true);
      setDisplayMode('imu');
      CalibrationService.addListener(handleCalibrationStateUpdate);
      CalibrationService.startCalibration();
    };
    
    initIMU();
    
    return () => {
      MotionService.stopMonitoring();
      CalibrationService.removeListener(handleCalibrationStateUpdate);
      CalibrationService.reset();
    };
  }, [isActive, onFallbackActivated, handleCalibrationStateUpdate]);
  
  // Handle IMU state updates
  const handleStateUpdate = useCallback((state: IMUState) => {
    setDirection(state.direction);
    
    // Forward velocity samples to CalibrationService during calibration
    if (CalibrationService.getState().isCalibrating) {
      CalibrationService.addVelocitySample(state.velocity, state.direction);
    } else if (CalibrationService.getState().isCalibrated) {
      // Update tempo indicator after calibration
      CalibrationService.updateTempoIndicator(state.velocity);
    }
  }, []);
  
  // Handle motion data for IMU mode
  const handleMotionData = useCallback((_data: MotionData) => {
    if (displayMode !== 'imu') return;
    
    const velocity = MotionService.getVelocity();
    const motionDirection = MotionService.getDirection();
    
    // Calculate scroll amount based on velocity and direction
    if (motionDirection !== 'stationary') {
      const scrollAmount = velocity * BASE_SCROLL_MULTIPLIER;
      const directionMultiplier = motionDirection === 'right' ? -1 : 1;
      
      // Update position with spring animation for smooth response
      const newX = translateX.value + (scrollAmount * directionMultiplier);
      
      // Clamp to valid range
      const minX = -textWidth;
      const maxX = screenWidth;
      const clampedX = Math.max(minX, Math.min(maxX, newX));
      
      translateX.value = withSpring(clampedX, {
        damping: 20,
        stiffness: 200,
        mass: 0.5,
      });
    }
  }, [displayMode, translateX, textWidth, screenWidth]);
  
  // Start/stop monitoring based on mode and activity
  useEffect(() => {
    if (!isActive) {
      MotionService.stopMonitoring();
      cancelAnimation(translateX);
      return;
    }
    
    if (displayMode === 'imu') {
      // Start IMU monitoring
      MotionService.addStateListener(handleStateUpdate);
      MotionService.startMonitoring(handleMotionData);
    } else if (displayMode === 'auto-scroll' && !autoScrollActive.current) {
      // Start auto-scroll fallback animation
      autoScrollActive.current = true;
      
      // Calculate animation duration for smooth scroll
      const distance = screenWidth + textWidth;
      const duration = (distance / 200) * 1000; // 200 px/s
      
      // Start initial animation from right side
      translateX.value = screenWidth;
      translateX.value = withTiming(-textWidth, {
        duration,
        easing: Easing.linear,
      });
      
      // Repeat animation at interval
      const interval = setInterval(() => {
        // Reset and start new animation in one call using sequence
        translateX.value = screenWidth;
        translateX.value = withTiming(-textWidth, {
          duration,
          easing: Easing.linear,
        });
      }, duration);
      
      return () => {
        clearInterval(interval);
        autoScrollActive.current = false;
      };
    }
    
    return () => {
      MotionService.removeStateListener(handleStateUpdate);
    };
  }, [isActive, displayMode, translateX, screenWidth, textWidth, handleStateUpdate, handleMotionData]);
  
  // Recalibrate function
  const recalibrate = useCallback(() => {
    MotionService.recalibrate();
    CalibrationService.recalibrate();
    translateX.value = screenWidth;
  }, [translateX, screenWidth]);
  
  // Toggle metronome
  const setMetronomeEnabled = useCallback((enabled: boolean) => {
    CalibrationService.setMetronomeEnabled(enabled);
  }, []);
  
  return {
    translateX,
    displayMode,
    isCalibrated,
    isCalibrating,
    calibrationProgress,
    tempoIndicator,
    direction,
    isIMUAvailable,
    recalibrate,
    permissionDenied,
    metronomeEnabled,
    setMetronomeEnabled,
  };
};
