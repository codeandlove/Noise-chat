/**
 * Safety utilities for flicker protection and animation rate control
 * Implements US-006: Safety — flicker protection
 */

import { APP_CONFIG } from '../constants';

/**
 * Minimum safe animation frequency in Hz
 * Below this rate, rapid blinking may be perceivable and uncomfortable
 */
export const MIN_SAFE_FREQUENCY_HZ = APP_CONFIG.FLICKER_SAFE_MIN_HZ;

/**
 * Maximum safe animation frequency in Hz
 * Above this rate, some devices may struggle to render smoothly
 */
export const MAX_SAFE_FREQUENCY_HZ = APP_CONFIG.FLICKER_SAFE_MAX_HZ;

/**
 * Calculate animation frequency from duration
 * @param durationMs - Animation cycle duration in milliseconds
 * @returns Frequency in Hz
 */
export const calculateFrequencyFromDuration = (durationMs: number): number => {
  if (durationMs <= 0) return 0;
  return 1000 / durationMs;
};

/**
 * Calculate safe animation duration from distance and desired speed
 * Ensures the resulting animation frequency stays within safe bounds
 * @param distancePixels - Total animation distance in pixels
 * @param speedPixelsPerSecond - Desired speed in pixels per second
 * @returns Safe duration in milliseconds
 */
export const calculateSafeAnimationDuration = (
  distancePixels: number,
  speedPixelsPerSecond: number
): number => {
  if (distancePixels <= 0 || speedPixelsPerSecond <= 0) {
    return 1000; // Default 1 second
  }

  // Calculate raw duration based on desired speed
  const rawDurationMs = (distancePixels / speedPixelsPerSecond) * 1000;
  
  // Calculate the cycle frequency this would produce
  const frequency = calculateFrequencyFromDuration(rawDurationMs);
  
  // Clamp frequency to safe range
  const safeFrequency = clampFrequency(frequency);
  
  // Calculate duration from safe frequency
  return 1000 / safeFrequency;
};

/**
 * Clamp a frequency to the safe range
 * @param frequencyHz - Input frequency in Hz
 * @returns Clamped frequency within safe bounds
 */
export const clampFrequency = (frequencyHz: number): number => {
  return Math.max(MIN_SAFE_FREQUENCY_HZ, Math.min(MAX_SAFE_FREQUENCY_HZ, frequencyHz));
};

/**
 * Check if a given animation frequency is within safe bounds
 * @param frequencyHz - Frequency to check in Hz
 * @returns Whether the frequency is safe
 */
export const isFrequencySafe = (frequencyHz: number): boolean => {
  return frequencyHz >= MIN_SAFE_FREQUENCY_HZ && frequencyHz <= MAX_SAFE_FREQUENCY_HZ;
};

/**
 * Calculate safe scroll speed multiplier
 * Ensures animation speed stays within safe flicker-free bounds
 * @param baseSpeed - Base speed multiplier (1.0 = normal)
 * @param textLength - Number of characters in text
 * @param screenWidth - Screen width in pixels
 * @returns Safe speed multiplier
 */
export const calculateSafeSpeedMultiplier = (
  baseSpeed: number,
  textLength: number,
  screenWidth: number
): number => {
  // Estimate character width (matches constants in hooks)
  const CHAR_WIDTH = 20;
  const textWidth = textLength * CHAR_WIDTH;
  const totalDistance = screenWidth + textWidth;
  
  // Base scroll speed in px/s
  const BASE_SCROLL_SPEED = 200;
  const targetSpeed = BASE_SCROLL_SPEED * baseSpeed;
  
  // Calculate animation duration and frequency
  const durationMs = (totalDistance / targetSpeed) * 1000;
  const frequency = calculateFrequencyFromDuration(durationMs);
  
  // If frequency is within safe bounds, return original speed
  if (isFrequencySafe(frequency)) {
    return baseSpeed;
  }
  
  // Clamp to safe frequency and calculate new speed
  const safeFrequency = clampFrequency(frequency);
  const safeDurationMs = 1000 / safeFrequency;
  const safeSpeed = (totalDistance / safeDurationMs) * 1000;
  
  return safeSpeed / BASE_SCROLL_SPEED;
};

/**
 * Get auto-off timeout in milliseconds
 * Returns the configured auto-off timeout for display safety
 */
export const getAutoOffTimeout = (): number => {
  return APP_CONFIG.AUTO_OFF_TIMEOUT;
};

/**
 * Format remaining time for display
 * @param remainingMs - Remaining time in milliseconds
 * @returns Formatted string (e.g., "2:30")
 */
export const formatRemainingTime = (remainingMs: number): string => {
  const totalSeconds = Math.ceil(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};
