/**
 * Editor screen - text input and preview
 */

import React, { memo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { TextEditor, Button, ScrollPreview, BrightnessPrompt } from '../components';
import { useTextValidation } from '../hooks';
import { t } from '../i18n';
import { APP_CONFIG } from '../constants';
import BrightnessService from '../services/BrightnessService';

const COLORS = {
  background: '#000000',
  text: '#FFFFFF',
  accent: '#00FF00',
};

interface EditorScreenProps {
  onNavigateToDisplay?: (text: string, brightnessAccepted: boolean) => void;
}

export const EditorScreen: React.FC<EditorScreenProps> = memo(({ onNavigateToDisplay }) => {
  const { text, setText, validation, normalizedText, graphemeCount } = useTextValidation('');
  const [previewVisible, setPreviewVisible] = useState(true);
  const [showBrightnessPrompt, setShowBrightnessPrompt] = useState(false);

  const canStart = validation.isValid && text.length > 0;

  const handleStart = useCallback(() => {
    if (!canStart) return;
    setShowBrightnessPrompt(true);
  }, [canStart]);

  const handleBrightnessAccept = useCallback(async () => {
    setShowBrightnessPrompt(false);
    // Set maximum brightness
    await BrightnessService.setMaxBrightness();
    // Navigate to display screen with brightness accepted
    onNavigateToDisplay?.(normalizedText, true);
  }, [normalizedText, onNavigateToDisplay]);

  const handleBrightnessDeny = useCallback(() => {
    setShowBrightnessPrompt(false);
    // Navigate to display screen without brightness change
    onNavigateToDisplay?.(normalizedText, false);
  }, [normalizedText, onNavigateToDisplay]);

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

          {/* ScrollPreview - show only when there is text */}
          {normalizedText.length > 0 && (
            <View style={styles.previewSection}>
              <View style={styles.previewHeader}>
                <Text style={styles.previewTitle}>{t('editor.scrollPreview.title')}</Text>
                <TouchableOpacity onPress={() => setPreviewVisible(!previewVisible)}>
                  <Text style={styles.toggleButton}>
                    {previewVisible ? t('editor.scrollPreview.hide') : t('editor.scrollPreview.show')}
                  </Text>
                </TouchableOpacity>
              </View>
              
              {previewVisible && (
                <ScrollPreview
                  text={normalizedText}
                  isVisible={previewVisible}
                  speed={1.0}
                  direction="ltr"
                />
              )}
            </View>
          )}
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

      {/* Brightness Prompt Modal */}
      <BrightnessPrompt
        visible={showBrightnessPrompt}
        onAccept={handleBrightnessAccept}
        onDeny={handleBrightnessDeny}
      />
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
  previewSection: {
    marginTop: 24,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  previewTitle: {
    fontSize: 16,
    color: COLORS.accent,
    fontWeight: '600',
  },
  toggleButton: {
    fontSize: 14,
    color: COLORS.accent,
  },
  buttonContainer: {
    paddingTop: 24,
    alignItems: 'center',
  },
});
