/**
 * Brightness prompt modal component
 * Asks user permission to increase screen brightness before display mode
 */

import React, { memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { t } from '../i18n';

const COLORS = {
  background: 'rgba(0, 0, 0, 0.9)',
  surface: '#1a1a1a',
  text: '#FFFFFF',
  accent: '#00FF00',
  secondary: '#666666',
};

interface BrightnessPromptProps {
  visible: boolean;
  onAccept: () => void;
  onDeny: () => void;
}

export const BrightnessPrompt: React.FC<BrightnessPromptProps> = memo(({
  visible,
  onAccept,
  onDeny,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{t('settings.brightness')}</Text>
          <Text style={styles.message}>{t('settings.brightnessPrompt')}</Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.denyButton]}
              onPress={onDeny}
              accessibilityRole="button"
              accessibilityLabel={t('settings.deny')}
            >
              <Text style={[styles.buttonText, styles.denyButtonText]}>
                {t('settings.deny')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.acceptButton]}
              onPress={onAccept}
              accessibilityRole="button"
              accessibilityLabel={t('settings.allow')}
            >
              <Text style={[styles.buttonText, styles.acceptButtonText]}>
                {t('settings.allow')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
});

BrightnessPrompt.displayName = 'BrightnessPrompt';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButton: {
    backgroundColor: COLORS.accent,
  },
  denyButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  acceptButtonText: {
    color: '#000000',
  },
  denyButtonText: {
    color: COLORS.text,
  },
});
