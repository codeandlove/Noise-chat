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

/**
 * Constants for animation calculations
 */
const CHAR_WIDTH_ESTIMATE = 20; // px for monospace font at ~28px
const BASE_SCROLL_SPEED = 200; // px/s

interface UseScrollAnimationParams {
  /** Text to animate */
  text: string;
  /** Speed multiplier (0.5 = slow, 2.0 = fast). Default: 1.0 */
  speed?: number;
  /** Whether animation is active */
  isActive: boolean;
  /** Screen width for calculating distance */
  screenWidth: number;
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
}: UseScrollAnimationParams): UseScrollAnimationReturn => {
  // Calculate text width based on character count
  const textWidth = useMemo(() => {
    return text.length * CHAR_WIDTH_ESTIMATE;
  }, [text]);

  // Calculate total distance to scroll (screen width + text width)
  const distance = useMemo(() => {
    return screenWidth + textWidth;
  }, [screenWidth, textWidth]);

  // Calculate animation duration based on speed
  const animationDuration = useMemo(() => {
    const baseDuration = (distance / BASE_SCROLL_SPEED) * 1000; // ms
    return baseDuration / speed;
  }, [distance, speed]);

  // Shared value for translateX animation
  const translateX = useSharedValue(screenWidth);

  // Start/stop animation based on isActive and text changes
  useEffect(() => {
    if (isActive && text.length > 0) {
      // Reset position to start from right edge
      translateX.value = screenWidth;
      // Start infinite scroll animation
      translateX.value = withRepeat(
        withTiming(-textWidth, {
          duration: animationDuration,
          easing: Easing.linear,
        }),
        -1, // infinite
        false // no reverse
      );
    } else {
      // Cancel animation when not active
      cancelAnimation(translateX);
      translateX.value = screenWidth;
    }

    // Cleanup on unmount
    return () => {
      cancelAnimation(translateX);
    };
  }, [isActive, text, speed, screenWidth, textWidth, animationDuration, translateX]);

  return {
    translateX,
    textWidth,
    animationDuration,
  };
};
