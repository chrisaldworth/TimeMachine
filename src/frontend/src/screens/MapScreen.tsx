import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MapScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Map Screen</Text>
      <Text style={styles.subtitle}>Interactive world map with photo pins</Text>
      <Text style={styles.description}>
        This screen will display the interactive map with:
        - Photo pins clustered by location
        - Time slider for decade navigation
        - Zoom and pan controls
        - Satellite and street view options
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    color: '#666',
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default MapScreen;
