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
import { DISPLAY_CONFIG } from '../constants';

/**
 * Minimum duration for auto-scroll animation to prevent invalid native animation drivers
 */
const MIN_AUTO_SCROLL_DURATION_MS = 200;

/**
 * Maximum scroll amount to clamp IMU velocity to avoid extreme values
 */
const MAX_SCROLL_AMOUNT = 1000;

/**
 * Helper to check if a value is a finite number (defensive guard)
 */
const isFiniteNumber = (value: unknown): value is number => {
  return typeof value === 'number' && Number.isFinite(value);
};

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
 * Multiplier to convert velocity to scroll pixels
 */
const BASE_SCROLL_MULTIPLIER = 15;

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
  const textWidth = text.length * DISPLAY_CONFIG.CHAR_WIDTH;
  const autoScrollActive = useRef(false);
  const autoScrollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastTempoRef = useRef<TempoIndicator>('too-slow');
  const lastHapticTimeRef = useRef<number>(0);
  
  // Haptic throttle interval in ms
  const HAPTIC_THROTTLE_INTERVAL = 500;
  
  // Handle calibration state updates
  const handleCalibrationStateUpdate = useCallback((state: CalibrationState) => {
    setIsCalibrating(state.isCalibrating);
    setIsCalibrated(state.isCalibrated);
    setCalibrationProgress(state.progress);
    setTempoIndicator(state.tempoIndicator);
    setMetronomeEnabledState(state.metronomeEnabled);
    
    // Play haptic feedback on tempo change (throttled)
    const now = Date.now();
    if (
      state.tempoIndicator !== lastTempoRef.current && 
      state.isCalibrated &&
      now - lastHapticTimeRef.current > HAPTIC_THROTTLE_INTERVAL
    ) {
      CalibrationService.playTempoHaptic(state.tempoIndicator);
      lastTempoRef.current = state.tempoIndicator;
      lastHapticTimeRef.current = now;
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
      // Clamp scroll amount to safe range to avoid extreme values
      const rawScrollAmount = velocity * BASE_SCROLL_MULTIPLIER;
      const scrollAmount = Math.max(-MAX_SCROLL_AMOUNT, Math.min(MAX_SCROLL_AMOUNT, rawScrollAmount));
      const directionMultiplier = motionDirection === 'right' ? -1 : 1;
      
      // Update position with spring animation for smooth response
      const newX = translateX.value + (scrollAmount * directionMultiplier);
      
      // Clamp to valid range
      const minX = -textWidth;
      const maxX = screenWidth;
      const clampedX = Math.max(minX, Math.min(maxX, newX));
      
      // Defensive guard: verify all values are finite before calling withSpring
      if (!isFiniteNumber(clampedX) || !isFiniteNumber(minX) || !isFiniteNumber(maxX) || !isFiniteNumber(newX)) {
        console.warn('[useIMUMotion] Skipping IMU animation - invalid values detected:', {
          clampedX,
          minX,
          maxX,
          newX,
          scrollAmount,
          textWidth,
          screenWidth,
        });
        return;
      }
      
      translateX.value = withSpring(clampedX, {
        damping: 20,
        stiffness: 200,
        mass: 0.5,
      });
    }
  }, [displayMode, translateX, textWidth, screenWidth]);
  
  // Start/stop monitoring based on mode and activity
  useEffect(() => {
    // Clear any existing interval when effect runs
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
      autoScrollIntervalRef.current = null;
    }
    
    if (!isActive) {
      MotionService.stopMonitoring();
      cancelAnimation(translateX);
      autoScrollActive.current = false;
      return;
    }
    
    if (displayMode === 'imu') {
      // Start IMU monitoring
      MotionService.addStateListener(handleStateUpdate);
      MotionService.startMonitoring(handleMotionData);
    } else if (displayMode === 'auto-scroll' && !autoScrollActive.current) {
      // Defensive guard: validate dimensions before starting auto-scroll
      const safeScreenWidth = Number(screenWidth);
      const safeTextWidth = Number(textWidth);
      
      if (!isFiniteNumber(safeScreenWidth) || !isFiniteNumber(safeTextWidth) || safeScreenWidth <= 0 || safeTextWidth <= 0) {
        console.warn('[useIMUMotion] Skipping auto-scroll animation - invalid dimensions:', {
          screenWidth,
          textWidth,
          safeScreenWidth,
          safeTextWidth,
        });
        return;
      }
      
      // Start auto-scroll fallback animation
      autoScrollActive.current = true;
      
      // Calculate animation duration for smooth scroll
      const distance = safeScreenWidth + safeTextWidth;
      const rawDuration = (distance / 200) * 1000; // 200 px/s
      // Enforce minimum duration to prevent invalid animation drivers
      const duration = Math.max(MIN_AUTO_SCROLL_DURATION_MS, rawDuration);
      
      // Defensive guard: verify duration is valid
      if (!isFiniteNumber(duration)) {
        console.warn('[useIMUMotion] Skipping auto-scroll animation - invalid duration:', { duration, distance });
        autoScrollActive.current = false;
        return;
      }
      
      // Reset translateX to safe numeric value before starting animation
      const safeStartPosition = isFiniteNumber(safeScreenWidth) ? safeScreenWidth : 0;
      const safeEndPosition = isFiniteNumber(safeTextWidth) ? -safeTextWidth : 0;
      
      // Start initial animation from right side
      translateX.value = safeStartPosition;
      translateX.value = withTiming(safeEndPosition, {
        duration,
        easing: Easing.linear,
      });
      
      // Repeat animation at interval
      autoScrollIntervalRef.current = setInterval(() => {
        // Re-validate dimensions inside interval callback
        const currentScreenWidth = Number(screenWidth);
        const currentTextWidth = Number(textWidth);
        
        if (!isFiniteNumber(currentScreenWidth) || !isFiniteNumber(currentTextWidth) || 
            currentScreenWidth <= 0 || currentTextWidth <= 0) {
          console.warn('[useIMUMotion] Stopping auto-scroll interval - dimensions became invalid:', {
            screenWidth,
            textWidth,
          });
          if (autoScrollIntervalRef.current) {
            clearInterval(autoScrollIntervalRef.current);
            autoScrollIntervalRef.current = null;
          }
          autoScrollActive.current = false;
          return;
        }
        
        // Reset and start new animation
        translateX.value = safeStartPosition;
        translateX.value = withTiming(safeEndPosition, {
          duration,
          easing: Easing.linear,
        });
      }, duration);
      
      return () => {
        if (autoScrollIntervalRef.current) {
          clearInterval(autoScrollIntervalRef.current);
          autoScrollIntervalRef.current = null;
        }
        autoScrollActive.current = false;
      };
    }
    
    return () => {
      MotionService.removeStateListener(handleStateUpdate);
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
        autoScrollIntervalRef.current = null;
      }
    };
  }, [isActive, displayMode, translateX, screenWidth, textWidth, handleStateUpdate, handleMotionData]);
  
  // Recalibrate function
  const recalibrate = useCallback(() => {
    MotionService.recalibrate();
    CalibrationService.recalibrate();
    // Use safe numeric value for translateX reset
    translateX.value = isFiniteNumber(screenWidth) ? screenWidth : 0;
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
