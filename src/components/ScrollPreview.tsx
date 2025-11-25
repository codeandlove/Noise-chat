/**
 * Animated scroll preview component
 * Displays a dynamic preview of the scroll effect for POV text display
 */

import React, { memo, useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface ScrollPreviewProps {
  /** Normalized text to display */
  text: string;
  /** Whether the preview is visible/active */
  isVisible: boolean;
  /** Speed multiplier (0.5-2.0). Default: 1.0 */
  speed?: number;
  /** Scroll direction ('ltr' = left-to-right motion, 'rtl' = right-to-left motion). Default: 'ltr' */
  direction?: 'ltr' | 'rtl';
}

const COLORS = {
  background: '#000000',
  text: '#FFFFFF',
  accent: '#00FF00',
  containerBackground: 'rgba(0, 255, 0, 0.05)',
};

/**
 * Platform-specific monospace font family
 */
const MONOSPACE_FONT = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'monospace',
});

/**
 * ScrollPreview component
 * Renders an animated scrolling text preview using react-native-reanimated
 */
export const ScrollPreview: React.FC<ScrollPreviewProps> = memo(({
  text,
  isVisible,
  speed = 1.0,
  direction = 'ltr',
}) => {
  // Track screen dimensions for responsive layout
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  // Use the scroll animation hook with direction support
  const { translateX } = useScrollAnimation({
    text,
    speed,
    isActive: isVisible,
    screenWidth: dimensions.width,
    direction,
  });

  // Create animated style for the text
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  if (!text || text.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.previewWindow}>
        <Animated.Text
          style={[
            styles.scrollingText,
            animatedStyle,
          ]}
          numberOfLines={1}
        >
          {text}
        </Animated.Text>
      </View>
    </View>
  );
});

ScrollPreview.displayName = 'ScrollPreview';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 120,
    backgroundColor: COLORS.containerBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.accent,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  previewWindow: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  scrollingText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    fontFamily: MONOSPACE_FONT,
    position: 'absolute',
  },
});
