/**
 * Device capability detection utilities
 */

import { Platform } from 'react-native';
import Constants from 'expo-constants';

export const getDeviceInfo = () => {
  return {
    platform: Platform.OS,
    version: Platform.Version,
    model: Constants.deviceName || 'Unknown',
  };
};

export const supportsIMU = (): boolean => {
  // Most modern devices support IMU
  return true;
};

export const getRefreshRate = (): number => {
  // Default to 60Hz, can be enhanced with native modules
  return 60;
};

export const supportsThermalMonitoring = (): boolean => {
  return Platform.OS === 'ios';
};
