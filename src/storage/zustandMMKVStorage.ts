import type { StateStorage } from 'zustand/middleware';
import { mmkvStorage } from './mmkv';

/**
 * Zustand-compatible StateStorage adapter backed by MMKV.
 *
 * This bridges MMKV's synchronous API with Zustand's persist middleware,
 * which expects a StateStorage interface (getItem, setItem, removeItem).
 *
 * Why MMKV over AsyncStorage?
 * - MMKV is JSI-based: synchronous reads with no bridge overhead
 * - ~30x faster than AsyncStorage for read/write operations
 * - Direct C++ ↔ JS communication via JSI, no JSON serialization over the bridge
 */
export const zustandMMKVStorage: StateStorage = {
  getItem: (name: string): string | null => {
    const value = mmkvStorage.getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string): void => {
    mmkvStorage.set(name, value);
  },
  removeItem: (name: string): void => {
    mmkvStorage.delete(name);
  },
};
