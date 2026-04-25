import type { Story, SortMode } from '../types/story';

/**
 * Sorts an array of stories by the given mode.
 * - 'score': descending by score (highest first)
 * - 'time': descending by time (newest first)
 *
 * Returns a new array; does not mutate the input.
 */
export function sortStories(stories: readonly Story[], mode: SortMode): Story[] {
  return [...stories].sort((a, b) => {
    if (mode === 'score') {
      return b.score - a.score;
    }
    return b.time - a.time;
  });
}
