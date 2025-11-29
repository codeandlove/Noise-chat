/**
 * Service for managing screen brightness
 * Implements US-006: Safety — brightness control with automatic restoration
 */

import * as Brightness from 'expo-brightness';
import { AppState, AppStateStatus } from 'react-native';
import { APP_CONFIG } from '../constants';

type AppStateSubscription = { remove: () => void };

export class BrightnessService {
  private originalBrightness: number | null = null;
  private appStateSubscription: AppStateSubscription | null = null;
  private isBrightnessModified: boolean = false;

  /**
   * Get current screen brightness
   * @returns Brightness value between 0 and 1
   */
  async getCurrentBrightness(): Promise<number> {
    try {
      const brightness = await Brightness.getBrightnessAsync();
      return brightness;
    } catch (error) {
      console.error('Error getting brightness:', error);
      return APP_CONFIG.MIN_BRIGHTNESS;
    }
  }

  /**
   * Set screen brightness to maximum for display mode
   * Stores original brightness for later restoration
   * Sets up AppState listener for automatic restoration on background
   */
  async setMaxBrightness(): Promise<void> {
    try {
      // Store original brightness if not already stored
      if (this.originalBrightness === null) {
        this.originalBrightness = await this.getCurrentBrightness();
      }
      
      await Brightness.setBrightnessAsync(APP_CONFIG.MAX_BRIGHTNESS);
      this.isBrightnessModified = true;
      
      // Set up AppState listener for automatic restoration when app goes to background
      this.setupAppStateListener();
    } catch (error) {
      console.error('Error setting brightness:', error);
    }
  }

  /**
   * Restore brightness to original value
   * Cleans up AppState listener
   */
  async restoreBrightness(): Promise<void> {
    if (this.originalBrightness === null) {
      return;
    }

    try {
      await Brightness.setBrightnessAsync(this.originalBrightness);
      // Only reset after successful restoration
      this.originalBrightness = null;
      this.isBrightnessModified = false;
      
      // Clean up AppState listener
      this.removeAppStateListener();
    } catch (error) {
      console.error('Error restoring brightness:', error);
      // Keep originalBrightness to retry later
    }
  }

  /**
   * Request permission for brightness control
   * @returns Whether permission was granted
   */
  async requestPermission(): Promise<boolean> {
    try {
      const { status } = await Brightness.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting brightness permission:', error);
      return false;
    }
  }

  /**
   * Check if brightness has been modified from original
   */
  isBrightnessActive(): boolean {
    return this.isBrightnessModified;
  }

  /**
   * Get the stored original brightness value
   */
  getOriginalBrightness(): number | null {
    return this.originalBrightness;
  }

  /**
   * Set up AppState listener to restore brightness when app goes to background
   * This ensures brightness is restored even if user closes app unexpectedly
   */
  private setupAppStateListener(): void {
    if (this.appStateSubscription !== null) {
      return; // Already set up
    }

    this.appStateSubscription = AppState.addEventListener('change', this.handleAppStateChange);
  }

  /**
   * Remove AppState listener
   */
  private removeAppStateListener(): void {
    if (this.appStateSubscription !== null) {
      this.appStateSubscription.remove();
      this.appStateSubscription = null;
    }
  }

  /**
   * Handle AppState changes - restore brightness when app goes to background
   */
  private handleAppStateChange = (nextAppState: AppStateStatus): void => {
    if (nextAppState === 'background' || nextAppState === 'inactive') {
      // Restore brightness when app goes to background
      this.restoreBrightness();
    }
  };

  /**
   * Cleanup method to ensure brightness is restored and listeners are removed
   * Call this when the service is no longer needed
   */
  cleanup(): void {
    this.restoreBrightness();
    this.removeAppStateListener();
  }
}

export default new BrightnessService();
