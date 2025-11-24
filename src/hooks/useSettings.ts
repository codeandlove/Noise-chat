/**
 * Custom hook for managing app settings
 */

import { useState } from 'react';
import { AppSettings } from '../types';
import { DEFAULT_SETTINGS } from '../constants';

export const useSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  const updateSetting = <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return {
    settings,
    updateSetting,
  };
};
