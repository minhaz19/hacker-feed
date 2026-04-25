import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Story } from '../types/story';
import { zustandMMKVStorage } from '../storage/zustandMMKVStorage';

interface BookmarkState {
  /** Map of story ID → Story for O(1) lookups */
  bookmarks: Record<number, Story>;

  /** Actions */
  toggleBookmark: (story: Story) => void;
  removeBookmark: (id: number) => void;
  isBookmarked: (id: number) => boolean;
  getBookmarkedStories: () => Story[];
}

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarks: {},

      toggleBookmark: (story: Story) => {
        const { bookmarks } = get();
        if (bookmarks[story.id]) {
          // Remove bookmark
          const { [story.id]: _, ...remaining } = bookmarks;
          set({ bookmarks: remaining });
        } else {
          // Add bookmark
          set({ bookmarks: { ...bookmarks, [story.id]: story } });
        }
      },

      removeBookmark: (id: number) => {
        const { bookmarks } = get();
        const { [id]: _, ...remaining } = bookmarks;
        set({ bookmarks: remaining });
      },

      isBookmarked: (id: number) => {
        return !!get().bookmarks[id];
      },

      getBookmarkedStories: () => {
        return Object.values(get().bookmarks);
      },
    }),
    {
      name: 'hackerfeed-bookmarks',
      storage: createJSONStorage(() => zustandMMKVStorage),
    },
  ),
);
