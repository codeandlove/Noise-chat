import React, { useState, useCallback } from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { EditorScreen, DisplayScreen } from './src/screens';

type AppScreen = 'editor' | 'display';

export interface NavigationProps {
  text: string;
  brightnessAccepted: boolean;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('editor');
  const [displayProps, setDisplayProps] = useState<NavigationProps>({
    text: '',
    brightnessAccepted: false,
  });

  const handleNavigateToDisplay = useCallback((text: string, brightnessAccepted: boolean) => {
    setDisplayProps({ text, brightnessAccepted });
    setCurrentScreen('display');
  }, []);

  const handleNavigateToEditor = useCallback(() => {
    setCurrentScreen('editor');
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <SafeAreaView style={styles.safeArea}>
        {currentScreen === 'editor' ? (
          <EditorScreen onNavigateToDisplay={handleNavigateToDisplay} />
        ) : (
          <DisplayScreen
            text={displayProps.text}
            brightnessAccepted={displayProps.brightnessAccepted}
            onStop={handleNavigateToEditor}
          />
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  safeArea: {
    flex: 1,
  },
});
