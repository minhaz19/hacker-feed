import { clampRGBA } from 'react-native-reanimated/lib/typescript/Colors';
import type { HNItem, Story } from '../types/story';
import { extractDomain } from '../utils/url';

const BASE_URL = 'https://hacker-news.firebaseio.com/v0';
const STORIES_LIMIT = 20;

/**
 * Fetches the top story IDs from Hacker News.
 * Returns the first STORIES_LIMIT (20) IDs.
 */
async function fetchTopStoryIds(): Promise<number[]> {
  const response = await fetch(`${BASE_URL}/topstories.json`);
  if (!response.ok) {
    throw new Error(`Failed to fetch top stories: ${response.status}`);
  }
  const ids: number[] = await response.json();
  return ids.slice(0, STORIES_LIMIT);
}

/**
 * Fetches a single HN item by its ID.
 */
async function fetchItem(id: number): Promise<HNItem | null> {
  const response = await fetch(`${BASE_URL}/item/${id}.json`);
  if (!response.ok) {
    return null;
  }
  return response.json();
}

/**
 * Fetches the top 20 Hacker News stories.
 * Filters to only include items of type 'story' with a url.
 * Returns processed Story objects with extracted domains.
 */
export async function fetchTopStories(): Promise<Story[]> {
  const ids = await fetchTopStoryIds();
  const items = await Promise.all(ids.map(fetchItem));

  return items
    .filter(
      (item): item is HNItem =>
        item !== null && item.type === 'story' && !!item.url,
    )
    .map(item => ({
      id: item.id,
      title: item.title,
      url: item.url!,
      domain: extractDomain(item.url!),
      by: item.by,
      score: item.score,
      time: item.time,
    }));
}
