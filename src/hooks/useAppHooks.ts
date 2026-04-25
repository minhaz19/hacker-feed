import { useState, useEffect, useRef, useCallback } from 'react';
import NetInfo from '@react-native-community/netinfo';

/**
 * Custom hook for debounced search input.
 * Returns the debounced value after the specified delay.
 *
 * @param value - The raw input value
 * @param delay - Debounce delay in milliseconds (default: 300ms)
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}


/**
 * Hook that tracks network connectivity status.
 */
export function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected !== false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return isConnected;
}

/**
 * Hook to preserve and restore FlatList scroll position.
 */
export function useScrollPreservation() {
  const scrollOffset = useRef<number>(0);

  const onScroll = useCallback((event: { nativeEvent: { contentOffset: { y: number } } }) => {
    scrollOffset.current = event.nativeEvent.contentOffset.y;
  }, []);

  return { scrollOffset, onScroll };
}
