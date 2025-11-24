/**
 * Editor screen - text input and preview
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const EditorScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editor Screen</Text>
      <Text style={styles.subtitle}>Text input and preview will be shown here</Text>
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
