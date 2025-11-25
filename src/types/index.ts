/**
 * Core type definitions for Noise chat
 */

export interface DisplaySettings {
  text: string;
  mirror: boolean;
  brightness: number;
  tempo: number;
}

export interface CalibrationData {
  speed: number;
  direction: 'left' | 'right';
  timestamp: number;
}

export interface MotionData {
  x: number;
  y: number;
  z: number;
  timestamp: number;
}

export type DisplayMode = 'imu' | 'auto-scroll' | 'demo';

export type TempoIndicator = 'too-slow' | 'ok' | 'too-fast';

/**
 * Result of text validation
 */
export interface TextValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  normalizedText: string;
}

/**
 * Application settings
 */
export interface AppSettings {
  locale: 'pl' | 'en';
  hasCompletedOnboarding: boolean;
  analyticsOptIn: boolean;
  brightness: number;
  keepAwake: boolean;
  displayMode: DisplayMode;
}

/**
 * Supported characters type - uppercase letters, digits, space, punctuation, and Polish diacritics
 */
export type SupportedCharacter =
  | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M'
  | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z'
  | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  | ' ' | '.' | ',' | '!' | '?' | '-'
  | 'Ą' | 'Ć' | 'Ę' | 'Ł' | 'Ń' | 'Ó' | 'Ś' | 'Ź' | 'Ż';

export interface AnalyticsEvent {
  eventType: 
    | 'start_display'
    | 'stop_display'
    | 'brightness_accepted'
    | 'orientation_locked'
    | 'used_fallback'
    | 'calibration_count'
    | 'mirror_toggled';
  metadata?: Record<string, unknown>;
  timestamp: number;
}
