import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface OfflineBannerProps {
  isVisible: boolean;
}

/**
 * Offline connectivity banner shown at the top of the screen
 * when the device loses network connection.
 */
export const OfflineBanner: React.FC<OfflineBannerProps> = ({ isVisible }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>📡 No internet connection</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FF3B30',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
