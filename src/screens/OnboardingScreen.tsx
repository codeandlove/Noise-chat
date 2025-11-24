/**
 * Onboarding screen - shows safety warnings and instructions
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const OnboardingScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Onboarding Screen</Text>
      <Text style={styles.subtitle}>Safety warnings and instructions will be shown here</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
  },
});
