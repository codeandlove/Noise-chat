/**
 * Custom hook for IMU-synchronized motion control
 * Implements US-004: Motion sensor synchronization for POV effect
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
}

// Constants for scroll calculations
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
  const [tempoIndicator, setTempoIndicator] = useState<TempoIndicator>('too-slow');
  const [direction, setDirection] = useState<'left' | 'right' | 'stationary'>('stationary');
  const [isIMUAvailable, setIsIMUAvailable] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);
  
  // Animation values
  const translateX = useSharedValue(screenWidth);
  const textWidth = text.length * CHAR_WIDTH;
  const autoScrollActive = useRef(false);
  
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
      
      // IMU is ready
      setIsIMUAvailable(true);
      setDisplayMode('imu');
    };
    
    initIMU();
    
    return () => {
      MotionService.stopMonitoring();
    };
  }, [isActive, onFallbackActivated]);
  
  // Handle IMU state updates
  const handleStateUpdate = useCallback((state: IMUState) => {
    setIsCalibrated(state.isCalibrated);
    setTempoIndicator(state.tempoIndicator);
    setDirection(state.direction);
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
      translateX.value = screenWidth;
      
      // Calculate animation duration for smooth scroll
      const distance = screenWidth + textWidth;
      const duration = (distance / 200) * 1000; // 200 px/s
      
      const startAutoScroll = () => {
        translateX.value = screenWidth;
        translateX.value = withTiming(-textWidth, {
          duration,
          easing: Easing.linear,
        });
      };
      
      startAutoScroll();
      
      // Repeat animation
      const interval = setInterval(() => {
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
    translateX.value = screenWidth;
  }, [translateX, screenWidth]);
  
  return {
    translateX,
    displayMode,
    isCalibrated,
    tempoIndicator,
    direction,
    isIMUAvailable,
    recalibrate,
    permissionDenied,
  };
};
