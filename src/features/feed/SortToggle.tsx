import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { SortMode } from '../../types/story';
import { useFeedStore } from '../../store/feedStore';

/**
 * Toggle component for switching between score and time sort modes.
 * Sort state is persisted in the Zustand store and survives navigation.
 */
export const SortToggle: React.FC = () => {
  const sortMode = useFeedStore(state => state.sortMode);
  const setSortMode = useFeedStore(state => state.setSortMode);

  const handleScorePress = useCallback(() => {
    setSortMode('score');
  }, [setSortMode]);

  const handleTimePress = useCallback(() => {
    setSortMode('time');
  }, [setSortMode]);

  return (
    <View style={styles.container}>
      <SortButton
        label="🔥 Top"
        isActive={sortMode === 'score'}
        onPress={handleScorePress}
      />
      <SortButton
        label="🕐 New"
        isActive={sortMode === 'time'}
        onPress={handleTimePress}
      />
    </View>
  );
};

interface SortButtonProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

const SortButton: React.FC<SortButtonProps> = ({ label, isActive, onPress }) => (
  <TouchableOpacity
    style={[styles.button, isActive && styles.activeButton]}
    onPress={onPress}
    activeOpacity={0.7}>
    <Text style={[styles.buttonText, isActive && styles.activeButtonText]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1C1C1E',
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  activeButton: {
    backgroundColor: '#FF660020',
    borderColor: '#FF6600',
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
  },
  activeButtonText: {
    color: '#FF6600',
  },
});
