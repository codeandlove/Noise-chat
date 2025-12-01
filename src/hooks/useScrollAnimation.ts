/**
 * Custom hook for managing scroll animation
 */

import { useEffect, useMemo } from 'react';
import {
  useSharedValue,
  withRepeat,
  withTiming,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { DISPLAY_CONFIG } from '../constants';

/**
 * Minimum animation duration to prevent crashes from invalid timing values
 */
const MIN_ANIMATION_DURATION = 200;

/**
 * Validates that a number is finite and greater than zero
 */
const isValidPositive = (value: number): boolean => {
  return Number.isFinite(value) && value > 0;
};

interface UseScrollAnimationParams {
  /** Text to animate */
  text: string;
  /** Speed multiplier (0.5 = slow, 2.0 = fast). Default: 1.0 */
  speed?: number;
  /** Whether animation is active */
  isActive: boolean;
  /** Screen width for calculating distance */
  screenWidth: number;
  /** Scroll direction ('ltr' starts from right, 'rtl' starts from left). Default: 'ltr' */
  direction?: 'ltr' | 'rtl';
  /** Character width estimate in pixels. Default: from DISPLAY_CONFIG */
  charWidth?: number;
}

interface UseScrollAnimationReturn {
  /** Animated translateX value */
  translateX: SharedValue<number>;
  /** Calculated text width in pixels */
  textWidth: number;
  /** Animation duration in milliseconds */
  animationDuration: number;
}

/**
 * Hook for managing scroll animation with react-native-reanimated
 * Calculates text width and animation duration based on text length and speed
 * @param params - Animation parameters
 * @returns Animation values and calculated dimensions
 */
export const useScrollAnimation = ({
  text,
  speed = 1.0,
  isActive,
  screenWidth,
  direction = 'ltr',
  charWidth = DISPLAY_CONFIG.CHAR_WIDTH,
}: UseScrollAnimationParams): UseScrollAnimationReturn => {
  // Calculate text width based on character count
  const textWidth = useMemo(() => {
    return text.length * charWidth;
  }, [text, charWidth]);

  // Calculate total distance to scroll (screen width + text width)
  const distance = useMemo(() => {
    return screenWidth + textWidth;
  }, [screenWidth, textWidth]);

  // Calculate animation duration based on speed with minimum value
  const animationDuration = useMemo(() => {
    const baseDuration = (distance / DISPLAY_CONFIG.BASE_SCROLL_SPEED) * 1000; // ms
    const rawDuration = baseDuration / speed;
    // Ensure minimum duration and valid number
    return Math.max(MIN_ANIMATION_DURATION, Math.round(rawDuration));
  }, [distance, speed]);

  // Calculate start and end positions based on direction
  const { startPosition, endPosition } = useMemo(() => {
    // Use safe defaults if dimensions are invalid
    const safeScreenWidth = isValidPositive(screenWidth) ? screenWidth : 0;
    const safeTextWidth = textWidth > 0 ? textWidth : 0;
    
    if (direction === 'ltr') {
      // Text starts from right side of screen and scrolls left
      return { startPosition: safeScreenWidth, endPosition: -safeTextWidth };
    } else {
      // Text starts from left side of screen and scrolls right
      return { startPosition: -safeTextWidth, endPosition: safeScreenWidth };
    }
  }, [direction, screenWidth, textWidth]);

  // Shared value for translateX animation - use safe start position
  const translateX = useSharedValue(Number.isFinite(startPosition) ? startPosition : 0);

  // Start/stop animation based on isActive and text changes
  useEffect(() => {
    if (isActive && text.length > 0) {
      // Validate all animation parameters before starting
      if (!Number.isFinite(distance) || !isValidPositive(distance)) {
        console.warn('[useScrollAnimation] Cannot start animation - invalid distance:', {
          distance,
          screenWidth,
          textWidth,
        });
        cancelAnimation(translateX);
        return;
      }
      
      if (!Number.isFinite(animationDuration) || animationDuration <= 0) {
        console.warn('[useScrollAnimation] Cannot start animation - invalid duration:', {
          animationDuration,
          distance,
          speed,
        });
        cancelAnimation(translateX);
        return;
      }
      
      if (!Number.isFinite(startPosition) || !Number.isFinite(endPosition)) {
        console.warn('[useScrollAnimation] Cannot start animation - invalid positions:', {
          startPosition,
          endPosition,
          screenWidth,
          textWidth,
        });
        cancelAnimation(translateX);
        return;
      }
      
      // Reset position to safe start position before animation
      translateX.value = startPosition;
      
      // Start infinite scroll animation
      translateX.value = withRepeat(
        withTiming(endPosition, {
          duration: animationDuration,
          easing: Easing.linear,
        }),
        -1, // infinite
        false // no reverse
      );
    } else {
      // Cancel animation when not active
      cancelAnimation(translateX);
      translateX.value = Number.isFinite(startPosition) ? startPosition : 0;
    }

    // Cleanup on unmount
    return () => {
      cancelAnimation(translateX);
    };
  }, [isActive, text, speed, startPosition, endPosition, animationDuration, translateX, distance, screenWidth, textWidth]);

  return {
    translateX,
    textWidth,
    animationDuration,
  };
};
