/**
 * Service for managing tempo calibration with haptic metronome
 * Implements US-005: Tempo calibration with haptic/audio feedback
 */

import * as Haptics from 'expo-haptics';
import { TempoIndicator, CalibrationData } from '../types';
import { APP_CONFIG } from '../constants';

export interface CalibrationState {
  isCalibrating: boolean;
  isCalibrated: boolean;
  progress: number; // 0-1
  calibrationData: CalibrationData | null;
  tempoIndicator: TempoIndicator;
  metronomeEnabled: boolean;
}

type CalibrationStateListener = (state: CalibrationState) => void;

export class CalibrationService {
  private state: CalibrationState = {
    isCalibrating: false,
    isCalibrated: false,
    progress: 0,
    calibrationData: null,
    tempoIndicator: 'too-slow',
    metronomeEnabled: true,
  };

  private listeners: CalibrationStateListener[] = [];
  private metronomeInterval: ReturnType<typeof setInterval> | null = null;
  private calibrationTimeout: ReturnType<typeof setTimeout> | null = null;
  private velocitySamples: number[] = [];

  // Calibration thresholds
  private static readonly CALIBRATION_DURATION = APP_CONFIG.CALIBRATION_DURATION;
  private static readonly SAMPLES_NEEDED = 10;
  private static readonly VELOCITY_THRESHOLD = 0.5;
  private static readonly TEMPO_SLOW_THRESHOLD = 2.0;
  private static readonly TEMPO_FAST_THRESHOLD = 8.0;
  private static readonly METRONOME_INTERVAL = 500; // ms between haptic ticks

  /**
   * Start the calibration process
   */
  startCalibration(): void {
    if (this.state.isCalibrating) return;

    this.velocitySamples = [];
    this.state = {
      ...this.state,
      isCalibrating: true,
      isCalibrated: false,
      progress: 0,
      calibrationData: null,
    };
    this.notifyListeners();

    // Start metronome if enabled
    if (this.state.metronomeEnabled) {
      this.startMetronome();
    }

    // Auto-complete calibration after duration
    this.calibrationTimeout = setTimeout(() => {
      this.completeCalibration();
    }, CalibrationService.CALIBRATION_DURATION);
  }

  /**
   * Add a velocity sample during calibration
   */
  addVelocitySample(velocity: number, direction: 'left' | 'right' | 'stationary'): void {
    if (!this.state.isCalibrating) return;

    this.velocitySamples.push(velocity);

    // Update progress
    const progress = Math.min(
      this.velocitySamples.length / CalibrationService.SAMPLES_NEEDED,
      1
    );
    
    // Update tempo indicator based on current velocity
    const tempoIndicator = this.calculateTempoIndicator(velocity);

    this.state = {
      ...this.state,
      progress,
      tempoIndicator,
    };
    this.notifyListeners();

    // If we have enough samples with good motion, complete early
    if (
      this.velocitySamples.length >= CalibrationService.SAMPLES_NEEDED &&
      this.getAverageVelocity() > CalibrationService.VELOCITY_THRESHOLD
    ) {
      this.completeCalibration(direction);
    }
  }

  /**
   * Complete the calibration process
   */
  private completeCalibration(direction: 'left' | 'right' | 'stationary' = 'right'): void {
    if (this.calibrationTimeout) {
      clearTimeout(this.calibrationTimeout);
      this.calibrationTimeout = null;
    }

    this.stopMetronome();

    const avgVelocity = this.getAverageVelocity();
    const calibrationData: CalibrationData = {
      speed: avgVelocity,
      direction: direction === 'stationary' ? 'right' : direction,
      timestamp: Date.now(),
    };

    this.state = {
      ...this.state,
      isCalibrating: false,
      isCalibrated: true,
      progress: 1,
      calibrationData,
      tempoIndicator: this.calculateTempoIndicator(avgVelocity),
    };
    this.notifyListeners();

    // Give haptic success feedback
    this.playSuccessHaptic();
  }

  /**
   * Force recalibration
   */
  recalibrate(): void {
    this.stopCalibration();
    this.startCalibration();
  }

  /**
   * Stop calibration without completing
   */
  stopCalibration(): void {
    if (this.calibrationTimeout) {
      clearTimeout(this.calibrationTimeout);
      this.calibrationTimeout = null;
    }
    this.stopMetronome();
    this.velocitySamples = [];

    this.state = {
      ...this.state,
      isCalibrating: false,
      progress: 0,
    };
    this.notifyListeners();
  }

  /**
   * Reset all calibration state
   */
  reset(): void {
    this.stopCalibration();
    this.state = {
      isCalibrating: false,
      isCalibrated: false,
      progress: 0,
      calibrationData: null,
      tempoIndicator: 'too-slow',
      metronomeEnabled: this.state.metronomeEnabled,
    };
    this.notifyListeners();
  }

  /**
   * Update tempo indicator based on current velocity
   */
  updateTempoIndicator(velocity: number): void {
    const tempoIndicator = this.calculateTempoIndicator(velocity);
    if (tempoIndicator !== this.state.tempoIndicator) {
      this.state = {
        ...this.state,
        tempoIndicator,
      };
      this.notifyListeners();
    }
  }

  /**
   * Enable or disable haptic metronome
   */
  setMetronomeEnabled(enabled: boolean): void {
    this.state = {
      ...this.state,
      metronomeEnabled: enabled,
    };

    if (!enabled && this.metronomeInterval) {
      this.stopMetronome();
    } else if (enabled && this.state.isCalibrating) {
      this.startMetronome();
    }

    this.notifyListeners();
  }

  /**
   * Get current calibration state
   */
  getState(): CalibrationState {
    return { ...this.state };
  }

  /**
   * Subscribe to state changes
   */
  addListener(callback: CalibrationStateListener): void {
    if (!this.listeners.includes(callback)) {
      this.listeners.push(callback);
    }
  }

  /**
   * Unsubscribe from state changes
   */
  removeListener(callback: CalibrationStateListener): void {
    this.listeners = this.listeners.filter((l) => l !== callback);
  }

  /**
   * Play haptic feedback for tempo metronome
   */
  private async playMetronomeHaptic(): Promise<void> {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (_error) {
      // Haptics not available, continue silently
    }
  }

  /**
   * Play haptic feedback for successful calibration
   */
  private async playSuccessHaptic(): Promise<void> {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (_error) {
      // Haptics not available, continue silently
    }
  }

  /**
   * Play haptic feedback for tempo indicator changes
   */
  async playTempoHaptic(tempo: TempoIndicator): Promise<void> {
    if (!this.state.metronomeEnabled) return;

    try {
      switch (tempo) {
        case 'too-slow':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        case 'too-fast':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        case 'ok':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
      }
    } catch (_error) {
      // Haptics not available, continue silently
    }
  }

  private startMetronome(): void {
    if (this.metronomeInterval) return;

    // Initial tick
    this.playMetronomeHaptic();

    this.metronomeInterval = setInterval(() => {
      this.playMetronomeHaptic();
    }, CalibrationService.METRONOME_INTERVAL);
  }

  private stopMetronome(): void {
    if (this.metronomeInterval) {
      clearInterval(this.metronomeInterval);
      this.metronomeInterval = null;
    }
  }

  private calculateTempoIndicator(velocity: number): TempoIndicator {
    if (velocity < CalibrationService.TEMPO_SLOW_THRESHOLD) {
      return 'too-slow';
    } else if (velocity > CalibrationService.TEMPO_FAST_THRESHOLD) {
      return 'too-fast';
    }
    return 'ok';
  }

  private getAverageVelocity(): number {
    if (this.velocitySamples.length === 0) return 0;
    return this.velocitySamples.reduce((a, b) => a + b, 0) / this.velocitySamples.length;
  }

  private notifyListeners(): void {
    const state = this.getState();
    this.listeners.forEach((listener) => listener(state));
  }
}

export default new CalibrationService();
