import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

/**
 * Error state component with retry action.
 */
export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.button} onPress={onRetry}>
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#FF6600',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
});
