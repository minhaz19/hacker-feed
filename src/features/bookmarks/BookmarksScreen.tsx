import React, { useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import ReanimatedSwipeable, {
  type SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, {
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import { Trash2, TrendingUp, ChevronLeft, BookmarkX } from 'lucide-react-native';
import { useBookmarkStore } from '../../store/bookmarkStore';
import { EmptyState } from '../../components/shared';
import { getRelativeTime } from '../../utils/time';
import { getFaviconUrl } from '../../utils/url';
import type { Story } from '../../types/story';

function RightAction(
  _progress: SharedValue<number>,
  _translation: SharedValue<number>,
  swipeableMethods: SwipeableMethods,
  onDelete: () => void,
) {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: 1,
  }));

  return (
    <Animated.View style={[styles.rightActionContainer, animatedStyle]}>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => {
          swipeableMethods.close();
          onDelete();
        }}
        activeOpacity={0.7}>
        <Trash2 color="#FFFFFF" size={20} style={styles.deleteIcon} />
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

interface SwipeableBookmarkItemProps {
  story: Story;
  onRemove: (id: number) => void;
}

const SwipeableBookmarkItem: React.FC<SwipeableBookmarkItemProps> = ({
  story,
  onRemove,
}) => {
  const swipeableRef = useRef<SwipeableMethods>(null);

  const handleDelete = useCallback(() => {
    onRemove(story.id);
  }, [onRemove, story.id]);

  const renderRightActions = useCallback(
    (
      progress: SharedValue<number>,
      translation: SharedValue<number>,
      swipeableMethods: SwipeableMethods,
    ) => RightAction(progress, translation, swipeableMethods, handleDelete),
    [handleDelete],
  );

  const handleSwipeableOpen = useCallback(
    (direction: string) => {
      if (direction === 'right') {
        handleDelete();
      }
    },
    [handleDelete],
  );

  return (
    <ReanimatedSwipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      rightThreshold={80}
      overshootRight={false}
      overshootFriction={8}
      onSwipeableOpen={handleSwipeableOpen}
      containerStyle={styles.swipeableContainer}
      childrenContainerStyle={styles.swipeableChildContainer}>
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.faviconContainer}>
            <Image
              source={{ uri: getFaviconUrl(story.domain) }}
              style={styles.favicon}
              resizeMode="contain"
            />
          </View>
          <View style={styles.textContent}>
            <Text style={styles.title} numberOfLines={2}>
              {story.title}
            </Text>
            <View style={styles.metaRow}>
              <Text style={styles.domain}>{story.domain}</Text>
              <Text style={styles.separator}>•</Text>
              <View style={styles.scoreContainer}>
                <TrendingUp color="#30D158" size={11} />
                <Text style={styles.score}>{story.score}</Text>
              </View>
              <Text style={styles.separator}>•</Text>
              <Text style={styles.time}>{getRelativeTime(story.time)}</Text>
            </View>
          </View>
        </View>
        <View style={styles.swipeHint}>
          <ChevronLeft color="#48484A" size={14} />
        </View>
      </View>
    </ReanimatedSwipeable>
  );
};

/**
 * Bookmarks tab screen.
 */
export const BookmarksScreen: React.FC = () => {
  const bookmarks = useBookmarkStore(state => state.bookmarks);
  const removeBookmark = useBookmarkStore(state => state.removeBookmark);

  const bookmarkedStories = useMemo(
    () => Object.values(bookmarks),
    [bookmarks],
  );

  const handleRemove = useCallback(
    (id: number) => {
      removeBookmark(id);
    },
    [removeBookmark],
  );

  const keyExtractor = useCallback((item: Story) => String(item.id), []);

  const renderItem = useCallback(
    ({ item }: { item: Story }) => (
      <SwipeableBookmarkItem story={item} onRemove={handleRemove} />
    ),
    [handleRemove],
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      {bookmarkedStories.length > 0 && (
        <View style={styles.hintBanner}>
          <View style={styles.hintContent}>
            <ChevronLeft color="#636366" size={12} />
            <Text style={styles.hintBannerText}>Swipe left to remove</Text>
          </View>
        </View>
      )}
      <FlatList
        data={bookmarkedStories}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={
          bookmarkedStories.length === 0
            ? styles.emptyContainer
            : styles.listContent
        }
        ListEmptyComponent={
          <EmptyState
            Icon={BookmarkX}
            title="No bookmarks yet"
            message="Bookmark stories from the feed to save them for later."
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  listContent: {
    padding: 16,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
  },
  hintBanner: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  hintContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  hintBannerText: {
    fontSize: 12,
    color: '#636366',
  },
  swipeableContainer: {
    marginBottom: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  swipeableChildContainer: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
  },
  card: {
    backgroundColor: '#1C1C1E',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
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
  textContent: {
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
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
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
  swipeHint: {
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightActionContainer: {
    width: 90,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF453A',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  deleteButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  deleteIcon: {
    marginBottom: 4,
  },
  deleteText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
