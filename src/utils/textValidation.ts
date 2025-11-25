/**
 * Text validation utilities
 */

import { APP_CONFIG, ALLOWED_CHARS } from '../constants';
import type { TextValidationResult } from '../types';

/**
 * Map of character replacements for unsupported characters
 */
const CHARACTER_SUGGESTIONS: Record<string, string> = {
  // Lowercase to uppercase
  'a': 'A', 'b': 'B', 'c': 'C', 'd': 'D', 'e': 'E', 'f': 'F', 'g': 'G', 'h': 'H',
  'i': 'I', 'j': 'J', 'k': 'K', 'l': 'L', 'm': 'M', 'n': 'N', 'o': 'O', 'p': 'P',
  'q': 'Q', 'r': 'R', 's': 'S', 't': 'T', 'u': 'U', 'v': 'V', 'w': 'W', 'x': 'X',
  'y': 'Y', 'z': 'Z',
  // Polish lowercase to uppercase
  'ą': 'Ą', 'ć': 'Ć', 'ę': 'Ę', 'ł': 'Ł', 'ń': 'Ń', 'ó': 'Ó', 'ś': 'Ś', 'ź': 'Ź', 'ż': 'Ż',
  // Common replacements
  '@': 'A',
  '&': 'I',
  '+': 'T',
  '=': '-',
  '_': '-',
  ';': ',',
  ':': '.',
  '\'': '',
  '"': '',
  // German umlauts to closest equivalent
  'ä': 'A', 'Ä': 'A',
  'ö': 'O', 'Ö': 'O',
  'ü': 'U', 'Ü': 'U',
  'ß': 'S',
  // French accents
  'é': 'E', 'É': 'E',
  'è': 'E', 'È': 'E',
  'ê': 'E', 'Ê': 'E',
  'ë': 'E', 'Ë': 'E',
  'à': 'A', 'À': 'A',
  'â': 'A', 'Â': 'A',
  'î': 'I', 'Î': 'I',
  'ï': 'I', 'Ï': 'I',
  'ô': 'O', 'Ô': 'O',
  'ù': 'U', 'Ù': 'U',
  'û': 'U', 'Û': 'U',
  'ç': 'C', 'Ç': 'C',
};

/**
 * Count graphemes (user-perceived characters) in a string.
 * This correctly handles Unicode characters like emojis and combining characters.
 * @param text - The text to count graphemes in
 * @returns The number of graphemes
 */
export const countGraphemes = (text: string): number => {
  // Use Intl.Segmenter if available for proper grapheme counting
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
    return [...segmenter.segment(text)].length;
  }
  // Fallback: spread operator handles most cases including emoji
  return [...text].length;
};

/**
 * Normalizes text by converting to uppercase.
 * Handles Polish diacritics correctly.
 * @param text - The text to normalize
 * @returns The normalized uppercase text
 */
export const normalizeText = (text: string): string => {
  return text.toUpperCase();
};

/**
 * Get a suggested replacement character for an unsupported character.
 * @param char - The unsupported character
 * @returns The suggested replacement, or null if no suggestion
 */
export const getSupportedCharacterSuggestions = (char: string): string | null => {
  return CHARACTER_SUGGESTIONS[char] ?? null;
};

/**
 * Check if a character is supported after normalization to uppercase.
 * @param char - The character to check
 * @returns Whether the character is supported
 */
const isCharacterSupported = (char: string): boolean => {
  const upperChar = char.toUpperCase();
  return ALLOWED_CHARS.has(upperChar);
};

/**
 * Validates text according to app requirements.
 * Checks length (max 10 graphemes) and allowed characters.
 * @param text - The text to validate
 * @returns Validation result with errors, warnings, and normalized text
 */
export const validateText = (text: string): TextValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const normalizedText = normalizeText(text);
  const graphemeCount = countGraphemes(text);

  // Check length
  if (graphemeCount > APP_CONFIG.MAX_TEXT_LENGTH) {
    errors.push('textTooLong');
  }

  // Check for invalid characters
  const invalidChars: string[] = [];
  const suggestions: Map<string, string> = new Map();

  for (const char of [...text]) {
    if (!isCharacterSupported(char)) {
      invalidChars.push(char);
      const suggestion = getSupportedCharacterSuggestions(char);
      if (suggestion !== null) {
        suggestions.set(char, suggestion);
      }
    }
  }

  if (invalidChars.length > 0) {
    const uniqueInvalidChars = [...new Set(invalidChars)];
    errors.push(`invalidCharacters:${uniqueInvalidChars.join('')}`);
    
    // Add suggestions as warnings
    for (const [original, replacement] of suggestions) {
      warnings.push(`characterSuggestion:${original}:${replacement}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    normalizedText,
  };
};

/**
 * Get the number of remaining characters.
 * @param text - The current text
 * @returns Number of remaining characters
 */
export const getRemainingCharacters = (text: string): number => {
  return APP_CONFIG.MAX_TEXT_LENGTH - countGraphemes(text);
};
