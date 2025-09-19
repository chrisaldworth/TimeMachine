import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const UploadScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Screen</Text>
      <Text style={styles.subtitle}>Photo upload with location and metadata</Text>
      <Text style={styles.description}>
        This screen will handle photo uploads with:
        - Drag and drop photo selection
        - Location pin placement on map
        - Decade selection (10-year periods)
        - Title, description, and tags
        - EXIF data extraction
        - Upload progress tracking
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

export default UploadScreen;
