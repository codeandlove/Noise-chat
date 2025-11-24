/**
 * Application constants
 */

export const APP_CONFIG = {
  MAX_TEXT_LENGTH: 10,
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
  IMMERSIVE_MODE: true,
  DEFAULT_TEMPO: 1.0,
  MIN_TEMPO: 0.5,
  MAX_TEMPO: 2.0,
} as const;

export const SUPPORTED_LOCALES = ['pl', 'en'] as const;

export const DEFAULT_SETTINGS = {
  brightness: 1.0,
  keepAwake: false,
  displayMode: 'imu' as const,
  locale: 'en' as const,
  onboardingCompleted: false,
  analyticsOptIn: false,
};
