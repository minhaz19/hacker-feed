import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useEffect, useRef } from 'react';

interface SkeletonLoaderProps {
  count?: number;
}

/**
 * Skeleton loader that mimics the article list layout.
 * Uses Animated API for a pulsing shimmer effect.
 */
export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ count = 6 }) => {
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [pulseAnim]);

  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <Animated.View
          key={index}
          style={[styles.card, { opacity: pulseAnim }]}>
          <View style={styles.row}>
            <View style={styles.favicon} />
            <View style={styles.content}>
              <View style={styles.titleLine} />
              <View style={styles.titleLineShort} />
              <View style={styles.metaRow}>
                <View style={styles.metaItem} />
                <View style={styles.metaItem} />
                <View style={styles.metaItemShort} />
              </View>
            </View>
          </View>
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
  },
  favicon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#2C2C2E',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  titleLine: {
    height: 14,
    borderRadius: 4,
    backgroundColor: '#2C2C2E',
    marginBottom: 8,
    width: '100%',
  },
  titleLineShort: {
    height: 14,
    borderRadius: 4,
    backgroundColor: '#2C2C2E',
    marginBottom: 12,
    width: '60%',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metaItem: {
    height: 10,
    borderRadius: 4,
    backgroundColor: '#2C2C2E',
    width: 60,
  },
  metaItemShort: {
    height: 10,
    borderRadius: 4,
    backgroundColor: '#2C2C2E',
    width: 40,
  },
});
