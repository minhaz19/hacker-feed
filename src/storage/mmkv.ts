import { createMMKV } from 'react-native-mmkv';

/**
 * Singleton MMKV storage instance.
 * Used for all key-value persistence in the app (bookmarks, preferences, etc.).
 */
export const mmkvStorage = createMMKV({
  id: 'hackerfeed-storage',
});
