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

  // Calculate animation duration based on speed
  const animationDuration = useMemo(() => {
    const baseDuration = (distance / DISPLAY_CONFIG.BASE_SCROLL_SPEED) * 1000; // ms
    return baseDuration / speed;
  }, [distance, speed]);

  // Calculate start and end positions based on direction
  const { startPosition, endPosition } = useMemo(() => {
    if (direction === 'ltr') {
      // Text starts from right side of screen and scrolls left
      return { startPosition: screenWidth, endPosition: -textWidth };
    } else {
      // Text starts from left side of screen and scrolls right
      return { startPosition: -textWidth, endPosition: screenWidth };
    }
  }, [direction, screenWidth, textWidth]);

  // Shared value for translateX animation
  const translateX = useSharedValue(startPosition);

  // Start/stop animation based on isActive and text changes
  useEffect(() => {
    if (isActive && text.length > 0) {
      // Reset position to start position
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
      translateX.value = startPosition;
    }

    // Cleanup on unmount
    return () => {
      cancelAnimation(translateX);
    };
  }, [isActive, text, speed, startPosition, endPosition, animationDuration, translateX]);

  return {
    translateX,
    textWidth,
    animationDuration,
  };
};
