/**
 * Internationalization configuration
 */

import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import pl from './locales/pl.json';
import en from './locales/en.json';

const i18n = new I18n({
  pl,
  en,
});

// Set the locale once at the beginning of your app.
i18n.locale = Localization.locale;
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

export default i18n;
