/**
 * Display screen - POV effect with scrolling text
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const DisplayScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Display Screen</Text>
      <Text style={styles.subtitle}>POV text effect will be shown here</Text>
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
