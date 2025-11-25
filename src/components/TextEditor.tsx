/**
 * Text input component with validation and character counter
 */

import React, { memo } from 'react';
import { TextInput, View, Text, StyleSheet, Platform } from 'react-native';
import type { TextValidationResult } from '../types';
import { APP_CONFIG } from '../constants';
import { t } from '../i18n';

interface TextEditorProps {
  value: string;
  onChangeText: (text: string) => void;
  validation: TextValidationResult;
  maxLength?: number;
  placeholder?: string;
  graphemeCount?: number;
}

const COLORS = {
  background: '#000000',
  inputBackground: '#111111',
  text: '#FFFFFF',
  accent: '#00FF00',
  error: '#FF0000',
  warning: '#FFA500',
  border: '#333333',
  borderError: '#FF0000',
  placeholder: 'rgba(255, 255, 255, 0.5)',
};

/**
 * Parse error string to extract type and parameters
 */
const parseError = (error: string): { type: string; params: string } => {
  const [type, ...rest] = error.split(':');
  return { type, params: rest.join(':') };
};

/**
 * Parse warning string to extract type and parameters
 */
const parseWarning = (warning: string): { type: string; original: string; replacement: string } => {
  const [type, original, replacement] = warning.split(':');
  return { type, original, replacement };
};

export const TextEditor: React.FC<TextEditorProps> = memo(({
  value,
  onChangeText,
  validation,
  maxLength = APP_CONFIG.MAX_TEXT_LENGTH,
  placeholder,
  graphemeCount = 0,
}) => {
  const { errors, warnings, normalizedText } = validation;
  const hasErrors = errors.length > 0;
  const fits = graphemeCount <= maxLength;

  // Format error messages with i18n
  const errorMessages = errors.map((error) => {
    const { type, params } = parseError(error);
    if (type === 'textTooLong') {
      return t('errors.textTooLong', { max: maxLength });
    }
    if (type === 'invalidCharacters') {
      return t('errors.invalidCharacters', { chars: params });
    }
    return error;
  });

  // Format warning messages with i18n
  const warningMessages = warnings.map((warning) => {
    const { type, original, replacement } = parseWarning(warning);
    if (type === 'characterSuggestion') {
      return t('errors.characterSuggestion', { original, replacement });
    }
    return warning;
  });

  return (
    <View style={styles.container}>
      {/* Text Input */}
      <TextInput
        style={[
          styles.input,
          hasErrors && styles.inputError,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || t('editor.placeholder')}
        placeholderTextColor={COLORS.placeholder}
        autoCapitalize="characters"
        autoCorrect={false}
        spellCheck={false}
        returnKeyType="done"
        accessibilityLabel={t('editor.title')}
        accessibilityHint={t('editor.characterCounter', { count: graphemeCount, max: maxLength })}
      />

      {/* Live Preview */}
      {normalizedText.length > 0 && (
        <View style={styles.previewContainer}>
          <Text style={styles.previewLabel}>{t('editor.preview')}:</Text>
          <Text style={styles.previewText}>{normalizedText}</Text>
        </View>
      )}

      {/* Character Counter and Fits Indicator */}
      <View style={styles.statusRow}>
        <Text style={[
          styles.characterCounter,
          !fits && styles.characterCounterError,
        ]}>
          {t('editor.characterCounter', { count: graphemeCount, max: maxLength })}
        </Text>
        <Text style={[
          styles.fitsIndicator,
          fits ? styles.fitsOk : styles.fitsTooLong,
        ]}>
          {fits 
            ? t('editor.fitsIndicator.fits')
            : t('editor.fitsIndicator.tooLong')
          }
        </Text>
      </View>

      {/* Error Messages */}
      {errorMessages.map((message, index) => (
        <Text key={`error-${index}`} style={styles.errorText}>
          {message}
        </Text>
      ))}

      {/* Warning Messages (suggestions) */}
      {warningMessages.map((message, index) => (
        <Text key={`warning-${index}`} style={styles.warningText}>
          {message}
        </Text>
      ))}
    </View>
  );
});

TextEditor.displayName = 'TextEditor';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    fontSize: 24,
    color: COLORS.text,
    backgroundColor: COLORS.inputBackground,
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.border,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    minHeight: 60,
  },
  inputError: {
    borderColor: COLORS.borderError,
  },
  previewContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(0, 255, 0, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  previewLabel: {
    fontSize: 12,
    color: COLORS.accent,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  previewText: {
    fontSize: 28,
    color: COLORS.accent,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontWeight: 'bold',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  characterCounter: {
    fontSize: 14,
    color: COLORS.text,
  },
  characterCounterError: {
    color: COLORS.error,
  },
  fitsIndicator: {
    fontSize: 14,
    fontWeight: '600',
  },
  fitsOk: {
    color: COLORS.accent,
  },
  fitsTooLong: {
    color: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    marginTop: 8,
    fontSize: 14,
  },
  warningText: {
    color: COLORS.warning,
    marginTop: 8,
    fontSize: 14,
  },
});
