/**
 * Application constants
 */

/**
 * Set of allowed uppercase characters: A-Z, 0-9, space, punctuation, and Polish diacritics
 */
export const ALLOWED_CHARS = new Set([
  // English uppercase letters
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  // Digits
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  // Space and punctuation
  ' ', '.', ',', '!', '?', '-',
  // Polish diacritics (uppercase)
  'Ą', 'Ć', 'Ę', 'Ł', 'Ń', 'Ó', 'Ś', 'Ź', 'Ż',
]);

export const APP_CONFIG = {
  MAX_TEXT_LENGTH: 10, // in graphemes
  // Allowed characters: A-Z (English uppercase), 0-9 (digits), space, basic punctuation (.,!?-),
  // and Polish diacritics (ĄĆĘŁŃÓŚŹŻąćęłńóśźż)
  ALLOWED_CHARS_REGEX: /^[A-Z0-9\s.,!?\-ĄĆĘŁŃÓŚŹŻąćęłńóśźż]*$/,
  MIN_BRIGHTNESS: 0.5,
  MAX_BRIGHTNESS: 1.0,
  AUTO_OFF_TIMEOUT: 180000, // 3 minutes in milliseconds
  CALIBRATION_DURATION: 1000, // 1 second
  COUNTDOWN_DURATION: 2000, // 2 seconds
  FLICKER_SAFE_MIN_HZ: 15,
  FLICKER_SAFE_MAX_HZ: 25,
} as const;

export const DISPLAY_CONFIG = {
  HORIZONTAL_MARGIN: 0.08, // 8% margin
  HORIZONTAL_MARGIN_PERCENT: '8%', // For style use
  IMMERSIVE_MODE: true,
  DEFAULT_TEMPO: 1.0,
  MIN_TEMPO: 0.5,
  MAX_TEMPO: 2.0,
  TEXT_FONT_SIZE: 120,
  TEXT_LETTER_SPACING: 8,
  CHAR_WIDTH: 20, // px per character (monospace font estimate)
  BASE_SCROLL_SPEED: 200, // px/s for scroll animation
} as const;

export const SUPPORTED_LOCALES = ['pl', 'en'] as const;

export const DEFAULT_SETTINGS = {
  locale: 'pl' as const,
  hasCompletedOnboarding: false,
  analyticsOptIn: false,
  brightness: 1.0,
  keepAwake: false,
  displayMode: 'imu' as const,
};
