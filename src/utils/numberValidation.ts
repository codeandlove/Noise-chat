/**
 * Number validation utilities for defensive guards
 */

/**
 * Helper to check if a value is a finite number (defensive guard)
 * @param value - The value to check
 * @returns true if value is a finite number, false otherwise
 */
export const isFiniteNumber = (value: unknown): value is number => {
  return typeof value === 'number' && Number.isFinite(value);
};
