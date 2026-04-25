import React, { useEffect, useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  StyleSheet,
  StatusBar,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Inbox } from 'lucide-react-native';
import type { RootStackParamList } from '../../types/navigation';
import type { Story } from '../../types/story';
import { useFeedStore } from '../../store/feedStore';
import { useNetworkStatus, useScrollPreservation } from '../../hooks/useAppHooks';
import { StoryItem } from './StoryItem';
import { SearchBar } from './SearchBar';
import { SortToggle } from './SortToggle';
import { SkeletonLoader, EmptyState, ErrorState, OfflineBanner } from '../../components/shared';

const ITEM_HEIGHT = 96;

export const ArticleListScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const stories = useFeedStore(state => state.stories);
  const loadingState = useFeedStore(state => state.loadingState);
  const errorMessage = useFeedStore(state => state.errorMessage);
  const fetchStories = useFeedStore(state => state.fetchStories);
  const refreshStories = useFeedStore(state => state.refreshStories);
  const getFilteredStories = useFeedStore(state => state.getFilteredStories);
  const sortMode = useFeedStore(state => state.sortMode);
  const searchQuery = useFeedStore(state => state.searchQuery);

  const isConnected = useNetworkStatus();
  const { onScroll } = useScrollPreservation();

  // Fetch stories on mount
  useEffect(() => {
    if (stories.length === 0) {
      fetchStories();
    }
  }, [stories.length, fetchStories]);

  const filteredStories = useMemo(() => getFilteredStories(), [getFilteredStories, stories, sortMode, searchQuery]);

  const handleStoryPress = useCallback(
    (story: Story) => {
      navigation.navigate('ArticleDetail', { story });
    },
    [navigation],
  );

  const handleRefresh = useCallback(() => {
    refreshStories();
  }, [refreshStories]);

  const handleRetry = useCallback(() => {
    fetchStories();
  }, [fetchStories]);

  const keyExtractor = useCallback((item: Story) => String(item.id), []);

  const getItemLayout = useCallback(
    (_data: ArrayLike<Story> | null | undefined, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    [],
  );

  const renderItem = useCallback(
    ({ item }: { item: Story }) => (
      <StoryItem story={item} onPress={handleStoryPress} />
    ),
    [handleStoryPress],
  );

  // const ListHeaderComponent = useMemo(
  //   () => (
  //     <View>
  //       <SearchBar />
  //       <SortToggle />
  //     </View>
  //   ),
  //   [],
  // );

  // Show skeleton on first load
  if (loadingState === 'loading' && stories.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <OfflineBanner isVisible={!isConnected} />
        <SkeletonLoader count={8} />
      </View>
    );
  }

  // Show error state
  if (loadingState === 'error' && stories.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <OfflineBanner isVisible={!isConnected} />
        <ErrorState message={errorMessage ?? 'Unknown error'} onRetry={handleRetry} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <OfflineBanner isVisible={!isConnected} />
      <SearchBar />
      <SortToggle />
      <FlatList
        data={filteredStories}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        // ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={
          <EmptyState
            Icon={Inbox}
            title="No stories found"
            message="Try adjusting your search or pull to refresh."
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={loadingState === 'refreshing'}
            onRefresh={handleRefresh}
            tintColor="#FF6600"
            colors={['#FF6600']}
          />
        }
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.listContent}
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
    paddingBottom: 20,
  },
});
