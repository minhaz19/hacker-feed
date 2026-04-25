import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import type { Story } from '../../types/story';
import { getRelativeTime } from '../../utils/time';
import { getFaviconUrl } from '../../utils/url';

interface StoryItemProps {
  story: Story;
  onPress: (story: Story) => void;
}

/**
 * Memoised list item for the article feed.
 * Displays title, favicon, domain, score, and relative time.
 */
const StoryItemComponent: React.FC<StoryItemProps> = ({ story, onPress }) => {
  const handlePress = useCallback(() => {
    onPress(story);
  }, [story, onPress]);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
      testID={`story-item-${story.id}`}>
      <View style={styles.faviconContainer}>
        <Image
          source={{ uri: getFaviconUrl(story.domain) }}
          style={styles.favicon}
          resizeMode="contain"
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {story.title}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.domain}>{story.domain}</Text>
          <Text style={styles.separator}>•</Text>
          <Text style={styles.score}>▲ {story.score}</Text>
          <Text style={styles.separator}>•</Text>
          <Text style={styles.time}>{getRelativeTime(story.time)}</Text>
        </View>
      </View>
      <View style={styles.chevron}>
        <Text style={styles.chevronText}>›</Text>
      </View>
    </TouchableOpacity>
  );
};

export const StoryItem = React.memo(StoryItemComponent);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    padding: 14,
    // Subtle shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  faviconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  favicon: {
    width: 24,
    height: 24,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 20,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  domain: {
    fontSize: 12,
    color: '#FF6600',
    fontWeight: '500',
  },
  separator: {
    fontSize: 12,
    color: '#48484A',
    marginHorizontal: 6,
  },
  score: {
    fontSize: 12,
    color: '#30D158',
    fontWeight: '600',
  },
  time: {
    fontSize: 12,
    color: '#8E8E93',
  },
  chevron: {
    marginLeft: 8,
  },
  chevronText: {
    fontSize: 22,
    color: '#48484A',
    fontWeight: '300',
  },
});
