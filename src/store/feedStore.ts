import { create } from 'zustand';
import type { Story, SortMode, LoadingState } from '../types/story';
import { sortStories } from '../utils/sort';
import { fetchTopStories } from '../hooks/useHackerNewsApi';

interface FeedState {
  stories: Story[];
  sortMode: SortMode;
  loadingState: LoadingState;
  errorMessage: string | null;
  searchQuery: string;

  fetchStories: () => Promise<void>;
  refreshStories: () => Promise<void>;
  setSortMode: (mode: SortMode) => void;
  setSearchQuery: (query: string) => void;

  getSortedStories: () => Story[];
  getFilteredStories: () => Story[];
}

export const useFeedStore = create<FeedState>((set, get) => ({
  stories: [],
  sortMode: 'score',
  loadingState: 'idle',
  errorMessage: null,
  searchQuery: '',

  fetchStories: async () => {
    set({ loadingState: 'loading', errorMessage: null });
    try {
      const stories = await fetchTopStories();
      set({ stories, loadingState: 'idle' });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch stories';
      set({ loadingState: 'error', errorMessage: message });
    }
  },

  refreshStories: async () => {
    set({ loadingState: 'refreshing', errorMessage: null });
    try {
      const stories = await fetchTopStories();
      set({ stories, loadingState: 'idle' });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to refresh stories';
      set({ loadingState: 'error', errorMessage: message });
    }
  },

  setSortMode: (mode: SortMode) => {
    set({ sortMode: mode });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  getSortedStories: () => {
    const { stories, sortMode } = get();
    return sortStories(stories, sortMode);
  },

  getFilteredStories: () => {
    const { searchQuery } = get();
    const sorted = get().getSortedStories();

    if (!searchQuery.trim()) {
      return sorted;
    }

    const lowerQuery = searchQuery.toLowerCase();
    return sorted.filter(
      story =>
        story.title.toLowerCase().includes(lowerQuery) ||
        story.domain.toLowerCase().includes(lowerQuery) ||
        story.by.toLowerCase().includes(lowerQuery),
    );
  },
}));
