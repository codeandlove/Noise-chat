/**
 * Utils exports
 */

export {
  validateText,
  normalizeText,
  countGraphemes,
  getSupportedCharacterSuggestions,
  getRemainingCharacters,
} from './textValidation';

export {
  MIN_SAFE_FREQUENCY_HZ,
  MAX_SAFE_FREQUENCY_HZ,
  calculateFrequencyFromDuration,
  calculateSafeAnimationDuration,
  clampFrequency,
  isFrequencySafe,
  calculateSafeSpeedMultiplier,
  getAutoOffTimeout,
  formatRemainingTime,
} from './safety';
