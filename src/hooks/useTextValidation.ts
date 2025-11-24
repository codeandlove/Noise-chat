/**
 * Custom hook for text validation
 */

import { useState, useCallback } from 'react';
import { validateText, normalizeText, getRemainingCharacters } from '../utils/textValidation';

export const useTextValidation = (initialText = '') => {
  const [text, setText] = useState(initialText);
  const [error, setError] = useState<string | undefined>();

  const handleTextChange = useCallback((newText: string) => {
    const validation = validateText(newText);
    setText(newText);
    setError(validation.error);
  }, []);

  const normalizedText = normalizeText(text);
  const remaining = getRemainingCharacters(text);
  const isValid = !error && text.length > 0;

  return {
    text,
    normalizedText,
    error,
    remaining,
    isValid,
    handleTextChange,
  };
};
