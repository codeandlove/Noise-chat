/**
 * Text input component with validation
 */

import React from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps } from 'react-native';

interface TextEditorProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  maxLength?: number;
}

export const TextEditor: React.FC<TextEditorProps> = ({
  value,
  onChangeText,
  error,
  maxLength = 10,
  ...props
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        maxLength={maxLength}
        autoCapitalize="characters"
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    fontSize: 24,
    color: '#fff',
    backgroundColor: '#222',
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#444',
  },
  inputError: {
    borderColor: '#f00',
  },
  errorText: {
    color: '#f00',
    marginTop: 8,
    fontSize: 14,
  },
});
