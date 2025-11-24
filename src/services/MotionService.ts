/**
 * Service for managing motion sensors and IMU data
 */

import { DeviceMotion } from 'expo-sensors';
import { MotionData } from '../types';

export class MotionService {
  private subscription: any = null;
  private listeners: ((data: MotionData) => void)[] = [];

  async requestPermission(): Promise<boolean> {
    try {
      const { status } = await DeviceMotion.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting motion permission:', error);
      return false;
    }
  }

  startMonitoring(callback: (data: MotionData) => void): void {
    this.listeners.push(callback);
    
    if (!this.subscription) {
      DeviceMotion.setUpdateInterval(16); // ~60fps
      this.subscription = DeviceMotion.addListener((motionData) => {
        const data: MotionData = {
          x: motionData.acceleration?.x || 0,
          y: motionData.acceleration?.y || 0,
          z: motionData.acceleration?.z || 0,
          timestamp: Date.now(),
        };
        
        this.listeners.forEach((listener) => listener(data));
      });
    }
  }

  stopMonitoring(): void {
    if (this.subscription) {
      this.subscription.remove();
      this.subscription = null;
    }
    this.listeners = [];
  }
}

export default new MotionService();
