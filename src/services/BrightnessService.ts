/**
 * Service for managing screen brightness
 */

import * as Brightness from 'expo-brightness';

export class BrightnessService {
  private originalBrightness: number | null = null;

  async getCurrentBrightness(): Promise<number> {
    try {
      const brightness = await Brightness.getBrightnessAsync();
      return brightness;
    } catch (error) {
      console.error('Error getting brightness:', error);
      return 0.5;
    }
  }

  async setMaxBrightness(): Promise<void> {
    try {
      this.originalBrightness = await this.getCurrentBrightness();
      await Brightness.setBrightnessAsync(1.0);
    } catch (error) {
      console.error('Error setting brightness:', error);
    }
  }

  async restoreBrightness(): Promise<void> {
    try {
      if (this.originalBrightness !== null) {
        await Brightness.setBrightnessAsync(this.originalBrightness);
        this.originalBrightness = null;
      }
    } catch (error) {
      console.error('Error restoring brightness:', error);
    }
  }

  async requestPermission(): Promise<boolean> {
    try {
      const { status } = await Brightness.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting brightness permission:', error);
      return false;
    }
  }
}

export default new BrightnessService();
