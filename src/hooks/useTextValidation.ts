/**
 * Custom hook for text validation
 */

import { useState, useCallback, useMemo } from 'react';
import { validateText, normalizeText, countGraphemes } from '../utils/textValidation';
import type { TextValidationResult } from '../types';

interface UseTextValidationReturn {
  text: string;
  setText: (text: string) => void;
  validation: TextValidationResult;
  normalizedText: string;
  graphemeCount: number;
}

/**
 * Hook for managing text input with validation
 * @param initialText - Optional initial text value
 * @returns Text state, setter, validation result, and normalized text
 */
export const useTextValidation = (initialText = ''): UseTextValidationReturn => {
  const [text, setTextState] = useState(initialText);

  const validation = useMemo(() => validateText(text), [text]);
  const normalizedText = useMemo(() => normalizeText(text), [text]);
  const graphemeCount = useMemo(() => countGraphemes(text), [text]);

  const setText = useCallback((newText: string) => {
    setTextState(newText);
  }, []);

  return {
    text,
    setText,
    validation,
    normalizedText,
    graphemeCount,
  };
};
