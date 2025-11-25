/**
 * Internationalization configuration
 */

import { I18n, TranslateOptions } from 'i18n-js';
import * as Localization from 'expo-localization';
import pl from './locales/pl.json';
import en from './locales/en.json';

const i18n = new I18n({
  pl,
  en,
});

// Set the locale once at the beginning of your app.
// Get the primary locale (first part before dash, e.g., 'en' from 'en-US')
// Handle case when Localization.locale is undefined (web, some simulators, older devices)
const deviceLocale = Localization.locale?.split('-')[0] 
  || Localization.getLocales()[0]?.languageCode 
  || 'en';
i18n.locale = deviceLocale === 'pl' ? 'pl' : 'en';
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

/**
 * Translation function with interpolation support
 * @param key - The translation key (e.g., 'editor.title')
 * @param options - Optional interpolation options
 * @returns The translated string
 */
export const t = (key: string, options?: TranslateOptions): string => {
  return i18n.t(key, options);
};

/**
 * Set the current locale
 * @param locale - The locale to set ('pl' or 'en')
 */
export const setLocale = (locale: 'pl' | 'en'): void => {
  i18n.locale = locale;
};

/**
 * Get the current locale
 * @returns The current locale
 */
export const getLocale = (): string => {
  return i18n.locale;
};

export default i18n;
