/**
 * Editor screen - text input and preview
 */

import React, { memo } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextEditor, Button } from '../components';
import { useTextValidation } from '../hooks';
import { t } from '../i18n';
import { APP_CONFIG } from '../constants';

const COLORS = {
  background: '#000000',
  text: '#FFFFFF',
  accent: '#00FF00',
};

export const EditorScreen: React.FC = memo(() => {
  const { text, setText, validation, graphemeCount } = useTextValidation('');

  const canStart = validation.isValid && text.length > 0;

  const handleStart = () => {
    // Placeholder for start functionality - will be implemented in future US
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>{t('editor.title')}</Text>

        {/* Text Editor */}
        <View style={styles.editorContainer}>
          <TextEditor
            value={text}
            onChangeText={setText}
            validation={validation}
            maxLength={APP_CONFIG.MAX_TEXT_LENGTH}
            graphemeCount={graphemeCount}
          />
        </View>

        {/* Start Button */}
        <View style={styles.buttonContainer}>
          <Button
            title={t('editor.start')}
            onPress={handleStart}
            variant="primary"
            disabled={!canStart}
            size="large"
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
});

EditorScreen.displayName = 'EditorScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  editorContainer: {
    flex: 1,
  },
  buttonContainer: {
    paddingTop: 24,
    alignItems: 'center',
  },
});
