/**
 * Service for managing motion sensors and IMU data
 * Implements US-004: IMU synchronization for POV effect
 */

import { DeviceMotion, DeviceMotionMeasurement } from 'expo-sensors';
import { MotionData, CalibrationData, TempoIndicator } from '../types';

type Subscription = { remove: () => void };

// Calibration constants
const VELOCITY_SAMPLES = 10;
const CALIBRATION_THRESHOLD = 0.5; // m/s² minimum acceleration to detect motion
const TEMPO_SLOW_THRESHOLD = 2.0; // velocity threshold for "too slow"
const TEMPO_FAST_THRESHOLD = 8.0; // velocity threshold for "too fast"

export interface IMUState {
  isAvailable: boolean;
  hasPermission: boolean;
  isCalibrated: boolean;
  velocity: number;
  direction: 'left' | 'right' | 'stationary';
  tempoIndicator: TempoIndicator;
  calibrationData: CalibrationData | null;
}

export class MotionService {
  private subscription: Subscription | null = null;
  private listeners: ((data: MotionData) => void)[] = [];
  private stateListeners: ((state: IMUState) => void)[] = [];
  
  // IMU state
  private velocityHistory: number[] = [];
  private lastTimestamp: number = 0;
  private currentVelocity: number = 0;
  private currentDirection: 'left' | 'right' | 'stationary' = 'stationary';
  private isCalibrated: boolean = false;
  private calibrationData: CalibrationData | null = null;
  private hasPermission: boolean = false;
  private isAvailable: boolean = false;

  /**
   * Check if motion sensors are available on device
   */
  async checkAvailability(): Promise<boolean> {
    try {
      this.isAvailable = await DeviceMotion.isAvailableAsync();
      return this.isAvailable;
    } catch (error) {
      console.error('Error checking motion sensor availability:', error);
      this.isAvailable = false;
      return false;
    }
  }

  /**
   * Request permission for motion sensors
   */
  async requestPermission(): Promise<boolean> {
    try {
      const { status } = await DeviceMotion.requestPermissionsAsync();
      this.hasPermission = status === 'granted';
      return this.hasPermission;
    } catch (error) {
      console.error('Error requesting motion permission:', error);
      this.hasPermission = false;
      return false;
    }
  }

  /**
   * Initialize IMU - check availability and request permission
   * Returns true if IMU is ready to use
   */
  async initialize(): Promise<{ available: boolean; permitted: boolean }> {
    const available = await this.checkAvailability();
    if (!available) {
      return { available: false, permitted: false };
    }
    
    const permitted = await this.requestPermission();
    return { available, permitted };
  }

  /**
   * Start monitoring with automatic calibration
   */
  startMonitoring(callback: (data: MotionData) => void): void {
    // Prevent duplicate listeners
    if (this.listeners.includes(callback)) {
      return;
    }
    
    this.listeners.push(callback);
    
    if (!this.subscription) {
      // Reset state for new session
      this.velocityHistory = [];
      this.lastTimestamp = 0;
      this.currentVelocity = 0;
      this.currentDirection = 'stationary';
      this.isCalibrated = false;
      
      DeviceMotion.setUpdateInterval(16); // ~60fps
      this.subscription = DeviceMotion.addListener((motionData: DeviceMotionMeasurement) => {
        const timestamp = Date.now();
        const deltaTime = this.lastTimestamp > 0 ? (timestamp - this.lastTimestamp) / 1000 : 0;
        this.lastTimestamp = timestamp;
        
        // Use rotation rate for better motion detection (phone waving is rotation-based)
        const rotationX = motionData.rotationRate?.gamma || 0; // rotation around vertical axis
        const accelerationX = motionData.acceleration?.x || 0;
        
        // Calculate velocity from acceleration (integrate over time)
        if (deltaTime > 0 && deltaTime < 0.1) { // Sanity check on deltaTime
          // Combine rotation rate and acceleration for velocity estimate
          const velocityEstimate = Math.abs(rotationX) + Math.abs(accelerationX);
          
          // Add to history
          this.velocityHistory.push(velocityEstimate);
          if (this.velocityHistory.length > VELOCITY_SAMPLES) {
            this.velocityHistory.shift();
          }
          
          // Calculate smoothed velocity
          this.currentVelocity = this.velocityHistory.reduce((a, b) => a + b, 0) / this.velocityHistory.length;
          
          // Determine direction based on rotation
          if (Math.abs(rotationX) > CALIBRATION_THRESHOLD) {
            this.currentDirection = rotationX > 0 ? 'right' : 'left';
          } else {
            this.currentDirection = 'stationary';
          }
          
          // Auto-calibrate when stable motion detected
          if (!this.isCalibrated && this.velocityHistory.length >= VELOCITY_SAMPLES) {
            const avgVelocity = this.velocityHistory.reduce((a, b) => a + b, 0) / this.velocityHistory.length;
            if (avgVelocity > CALIBRATION_THRESHOLD) {
              this.calibrationData = {
                speed: avgVelocity,
                direction: this.currentDirection === 'stationary' ? 'right' : this.currentDirection,
                timestamp: Date.now(),
              };
              this.isCalibrated = true;
              this.notifyStateListeners();
            }
          }
        }
        
        const data: MotionData = {
          x: accelerationX,
          y: motionData.acceleration?.y || 0,
          z: motionData.acceleration?.z || 0,
          timestamp,
        };
        
        this.listeners.forEach((listener) => listener(data));
        this.notifyStateListeners();
      });
    }
  }

  /**
   * Get current tempo indicator for UI feedback
   */
  getTempoIndicator(): TempoIndicator {
    if (this.currentVelocity < TEMPO_SLOW_THRESHOLD) {
      return 'too-slow';
    } else if (this.currentVelocity > TEMPO_FAST_THRESHOLD) {
      return 'too-fast';
    }
    return 'ok';
  }

  /**
   * Get current velocity (for scroll speed calculation)
   */
  getVelocity(): number {
    return this.currentVelocity;
  }

  /**
   * Get current direction
   */
  getDirection(): 'left' | 'right' | 'stationary' {
    return this.currentDirection;
  }

  /**
   * Check if calibration is complete
   */
  isCalibrationComplete(): boolean {
    return this.isCalibrated;
  }

  /**
   * Get calibration data
   */
  getCalibrationData(): CalibrationData | null {
    return this.calibrationData;
  }

  /**
   * Force recalibration
   */
  recalibrate(): void {
    this.isCalibrated = false;
    this.calibrationData = null;
    this.velocityHistory = [];
    this.notifyStateListeners();
  }

  /**
   * Get full IMU state
   */
  getState(): IMUState {
    return {
      isAvailable: this.isAvailable,
      hasPermission: this.hasPermission,
      isCalibrated: this.isCalibrated,
      velocity: this.currentVelocity,
      direction: this.currentDirection,
      tempoIndicator: this.getTempoIndicator(),
      calibrationData: this.calibrationData,
    };
  }

  /**
   * Subscribe to state changes
   */
  addStateListener(callback: (state: IMUState) => void): void {
    if (!this.stateListeners.includes(callback)) {
      this.stateListeners.push(callback);
    }
  }

  /**
   * Unsubscribe from state changes
   */
  removeStateListener(callback: (state: IMUState) => void): void {
    this.stateListeners = this.stateListeners.filter((listener) => listener !== callback);
  }

  private notifyStateListeners(): void {
    const state = this.getState();
    this.stateListeners.forEach((listener) => listener(state));
  }

  stopMonitoring(): void {
    if (this.subscription) {
      this.subscription.remove();
      this.subscription = null;
    }
    this.listeners = [];
    this.stateListeners = [];
    this.velocityHistory = [];
    this.lastTimestamp = 0;
    this.currentVelocity = 0;
    this.currentDirection = 'stationary';
    this.isCalibrated = false;
  }

  removeListener(callback: (data: MotionData) => void): void {
    this.listeners = this.listeners.filter((listener) => listener !== callback);
    
    // Stop monitoring if no listeners remain
    if (this.listeners.length === 0 && this.subscription) {
      this.subscription.remove();
      this.subscription = null;
    }
  }
}

export default new MotionService();
