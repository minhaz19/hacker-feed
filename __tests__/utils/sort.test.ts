import { sortStories } from '../../src/utils/sort';
import type { Story } from '../../src/types/story';

/**
 * Unit tests for the sortStories utility function.
 */
describe('sortStories', () => {
  const mockStories: Story[] = [
    {
      id: 1,
      title: 'Low score, oldest',
      url: 'https://example.com/1',
      domain: 'example.com',
      by: 'user1',
      score: 10,
      time: 1700000000, // Oldest
    },
    {
      id: 2,
      title: 'High score, middle time',
      url: 'https://example.com/2',
      domain: 'example.com',
      by: 'user2',
      score: 500,
      time: 1700050000, // Middle
    },
    {
      id: 3,
      title: 'Medium score, newest',
      url: 'https://example.com/3',
      domain: 'example.com',
      by: 'user3',
      score: 100,
      time: 1700100000, // Newest
    },
  ];

  describe('sort by score', () => {
    it('should sort stories by score in descending order', () => {
      const result = sortStories(mockStories, 'score');

      expect(result[0].id).toBe(2); // score: 500
      expect(result[1].id).toBe(3); // score: 100
      expect(result[2].id).toBe(1); // score: 10
    });

    it('should return scores in descending numerical order', () => {
      const result = sortStories(mockStories, 'score');
      const scores = result.map(s => s.score);

      expect(scores).toEqual([500, 100, 10]);
    });
  });

  describe('sort by time', () => {
    it('should sort stories by time in descending order (newest first)', () => {
      const result = sortStories(mockStories, 'time');

      expect(result[0].id).toBe(3); // time: 1700100000 (newest)
      expect(result[1].id).toBe(2); // time: 1700050000
      expect(result[2].id).toBe(1); // time: 1700000000 (oldest)
    });

    it('should return times in descending order', () => {
      const result = sortStories(mockStories, 'time');
      const times = result.map(s => s.time);

      expect(times).toEqual([1700100000, 1700050000, 1700000000]);
    });
  });

  describe('immutability', () => {
    it('should not mutate the original array', () => {
      const original = [...mockStories];
      sortStories(mockStories, 'score');

      expect(mockStories).toEqual(original);
    });

    it('should return a new array instance', () => {
      const result = sortStories(mockStories, 'score');
      expect(result).not.toBe(mockStories);
    });
  });

  describe('edge cases', () => {
    it('should handle empty arrays', () => {
      const result = sortStories([], 'score');
      expect(result).toEqual([]);
    });

    it('should handle single-item arrays', () => {
      const single = [mockStories[0]];
      const result = sortStories(single, 'score');

      expect(result).toEqual(single);
      expect(result).not.toBe(single);
    });

    it('should handle stories with equal scores', () => {
      const equalScores: Story[] = [
        { ...mockStories[0], score: 100 },
        { ...mockStories[1], score: 100 },
      ];
      const result = sortStories(equalScores, 'score');

      expect(result).toHaveLength(2);
    });
  });
});
