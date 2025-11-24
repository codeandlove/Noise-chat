/**
 * Text validation utilities
 */

import { APP_CONFIG } from '../constants';

export const validateText = (text: string): { valid: boolean; error?: string } => {
  if (text.length === 0) {
    return { valid: true };
  }

  if (text.length > APP_CONFIG.MAX_TEXT_LENGTH) {
    return {
      valid: false,
      error: 'textTooLong',
    };
  }

  const upperText = text.toUpperCase();
  if (!APP_CONFIG.ALLOWED_CHARS_REGEX.test(upperText)) {
    return {
      valid: false,
      error: 'invalidCharacters',
    };
  }

  return { valid: true };
};

/**
 * Normalizes text for display by converting to uppercase and trimming whitespace.
 * Text is converted to uppercase for better readability in the POV effect,
 * as uppercase letters are more distinct when displayed rapidly.
 */
export const normalizeText = (text: string): string => {
  return text.toUpperCase().trim();
};

export const getRemainingCharacters = (text: string): number => {
  return APP_CONFIG.MAX_TEXT_LENGTH - text.length;
};
