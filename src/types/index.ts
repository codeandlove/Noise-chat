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

export interface AppSettings {
  brightness: number;
  keepAwake: boolean;
  displayMode: DisplayMode;
  locale: 'pl' | 'en';
  onboardingCompleted: boolean;
  analyticsOptIn: boolean;
}

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
