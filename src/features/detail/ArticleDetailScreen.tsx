import React, { useCallback, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Share,
  StatusBar,
  Image,
  Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Bookmark,
  BookmarkCheck,
  Share2,
  User,
  TrendingUp,
  Clock,
  Timer,
  ExternalLink,
} from 'lucide-react-native';
import type { RootStackParamList } from '../../types/navigation';
import { useBookmarkStore } from '../../store/bookmarkStore';
import { formatFullDate, getRelativeTime } from '../../utils/time';
import { getFaviconUrl } from '../../utils/url';

type Props = NativeStackScreenProps<RootStackParamList, 'ArticleDetail'>;

export const ArticleDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { story } = route.params;
  const isBookmarked = useBookmarkStore(state => state.isBookmarked(story.id));
  const toggleBookmark = useBookmarkStore(state => state.toggleBookmark);

  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        title: story.title,
        url: story.url,
        message: `${story.title}\n${story.url}`,
      });
    } catch {
      Alert.alert('Error', 'Failed to share this article.');
    }
  }, [story]);

  const handleBookmarkToggle = useCallback(() => {
    toggleBookmark(story);
  }, [story, toggleBookmark]);

  // Set up header buttons
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={handleBookmarkToggle} style={styles.headerButton}>
            {isBookmarked ? (
              <BookmarkCheck color="#FF6600" size={22} />
            ) : (
              <Bookmark color="#FF6600" size={22} />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
            <Share2 color="#FF6600" size={22} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, isBookmarked, handleBookmarkToggle, handleShare]);

  const handleOpenUrl = useCallback(async () => {
    try {
      const canOpen = await Linking.canOpenURL(story.url);
      if (canOpen) {
        await Linking.openURL(story.url);
      }
    } catch {
      Alert.alert('Error', 'Failed to open this link.');
    }
  }, [story.url]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Header card */}
        <View style={styles.card}>
          <View style={styles.sourceRow}>
            <Image
              source={{ uri: getFaviconUrl(story.domain, 64) }}
              style={styles.favicon}
              resizeMode="contain"
            />
            <Text style={styles.domain}>{story.domain}</Text>
          </View>

          <Text style={styles.title}>{story.title}</Text>

          <View style={styles.divider} />

          {/* Metadata */}
          <View style={styles.metaSection}>
            <MetaRow label="Author" value={story.by} Icon={User} />
            <MetaRow label="Score" value={`${story.score} points`} Icon={TrendingUp} />
            <MetaRow label="Posted" value={formatFullDate(story.time)} Icon={Clock} />
            <MetaRow label="Relative" value={getRelativeTime(story.time)} Icon={Timer} />
          </View>
        </View>

        {/* Link card */}
        <TouchableOpacity
          style={styles.linkCard}
          onPress={handleOpenUrl}
          activeOpacity={0.7}>
          <Text style={styles.linkLabel}>Open Article</Text>
          <Text style={styles.linkUrl} numberOfLines={2}>
            {story.url}
          </Text>
          <ExternalLink color="#0A84FF" size={20} style={styles.linkArrow} />
        </TouchableOpacity>

        {/* Bookmark status */}
        <TouchableOpacity
          style={[
            styles.bookmarkCard,
            isBookmarked && styles.bookmarkCardActive,
          ]}
          onPress={handleBookmarkToggle}
          activeOpacity={0.7}>
          {isBookmarked ? (
            <BookmarkCheck color="#FF6600" size={22} />
          ) : (
            <Bookmark color="#FF6600" size={22} />
          )}
          <Text style={styles.bookmarkText}>
            {isBookmarked ? 'Bookmarked' : 'Add to Bookmarks'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

interface MetaRowProps {
  label: string;
  value: string;
  Icon: React.ComponentType<{ color: string; size: number }>;
}

const MetaRow: React.FC<MetaRowProps> = ({ label, value, Icon }) => (
  <View style={styles.metaRow}>
    <View style={styles.metaIconContainer}>
      <Icon color="#8E8E93" size={16} />
    </View>
    <View style={styles.metaContent}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  favicon: {
    width: 28,
    height: 28,
    marginRight: 10,
    borderRadius: 6,
  },
  domain: {
    fontSize: 14,
    color: '#FF6600',
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 30,
    letterSpacing: -0.3,
  },
  divider: {
    height: 1,
    backgroundColor: '#2C2C2E',
    marginVertical: 20,
  },
  metaSection: {
    gap: 16,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIconContainer: {
    width: 28,
    alignItems: 'center',
  },
  metaContent: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  linkCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  linkLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0A84FF',
    marginBottom: 8,
  },
  linkUrl: {
    fontSize: 13,
    color: '#8E8E93',
    lineHeight: 18,
    marginBottom: 4,
  },
  linkArrow: {
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  bookmarkCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  bookmarkCardActive: {
    backgroundColor: '#FF660015',
    borderColor: '#FF6600',
  },
  bookmarkText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 6,
  },
});
