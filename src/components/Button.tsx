/**
 * Large action button component
 */

import React, { memo } from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

const COLORS = {
  primary: '#00FF00',
  secondary: '#333333',
  danger: '#FF0000',
  text: '#000000',
  textLight: '#FFFFFF',
  disabled: 'rgba(255, 255, 255, 0.3)',
};

const SIZES = {
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontSize: 14,
    minHeight: 36,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    fontSize: 16,
    minHeight: 44,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    fontSize: 18,
    minHeight: 48,
  },
};

export const Button: React.FC<ButtonProps> = memo(({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  size = 'large',
  style,
}) => {
  const sizeConfig = SIZES[size];
  
  const buttonStyle: ViewStyle = {
    paddingVertical: sizeConfig.paddingVertical,
    paddingHorizontal: sizeConfig.paddingHorizontal,
    minHeight: sizeConfig.minHeight,
  };

  const textStyle: TextStyle = {
    fontSize: sizeConfig.fontSize,
  };

  // Primary uses dark text, others use light text
  const textColor = variant === 'primary' ? COLORS.text : COLORS.textLight;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        buttonStyle,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      <Text style={[styles.text, textStyle, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
});

Button.displayName = 'Button';

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: COLORS.primary,
  },
  secondary: {
    backgroundColor: COLORS.secondary,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  danger: {
    backgroundColor: COLORS.danger,
  },
  disabled: {
    opacity: 0.3,
  },
  text: {
    fontWeight: 'bold',
  },
});
