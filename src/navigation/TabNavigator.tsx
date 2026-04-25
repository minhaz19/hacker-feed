import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import { Newspaper, Bookmark } from 'lucide-react-native';
import type { RootTabParamList } from '../types/navigation';
import { ArticleListScreen } from '../features/feed/ArticleListScreen';
import { BookmarksScreen } from '../features/bookmarks/BookmarksScreen';
import { useBookmarkStore } from '../store/bookmarkStore';

const Tab = createBottomTabNavigator<RootTabParamList>();

/**
 * Bottom tab navigator.
 * Contains the Feed and Bookmarks tabs.
 */
const TabNavigator: React.FC = () => {
  const bookmarkCount = useBookmarkStore(
    state => Object.keys(state.bookmarks).length,
  );

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#FF6600',
        tabBarInactiveTintColor: '#636366',
        tabBarLabelStyle: styles.tabBarLabel,
      }}>
      <Tab.Screen
        name="FeedTab"
        component={ArticleListScreen}
        options={{
          title: 'HackerFeed',
          headerShown: true,
          headerStyle: styles.header,
          headerTintColor: '#FF6600',
          headerTitleStyle: styles.feedHeaderTitle,
          headerShadowVisible: false,
          tabBarLabel: 'Feed',
          tabBarIcon: ({ color, size }) => (
            <Newspaper color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="BookmarksTab"
        component={BookmarksScreen}
        options={{
          title: 'Bookmarks',
          headerShown: true,
          headerStyle: styles.header,
          headerTintColor: '#FF6600',
          headerTitleStyle: styles.headerTitle,
          headerShadowVisible: false,
          tabBarLabel: 'Bookmarks',
          tabBarIcon: ({ color, size }) => (
            <Bookmark color={color} size={size} />
          ),
          tabBarBadge: bookmarkCount > 0 ? bookmarkCount : undefined,
          tabBarBadgeStyle: styles.badge,
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#1C1C1E',
    borderTopColor: '#2C2C2E',
    borderTopWidth: 0.5,
    paddingBottom: 4,
    height: 84,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  header: {
    backgroundColor: '#000000',
  },
  headerTitle: {
    fontWeight: '700',
    fontSize: 17,
    color: '#FF6600',
  },
  feedHeaderTitle: {
    fontWeight: '800',
    fontSize: 30,
    color: '#FF6600',
  },
  badge: {
    backgroundColor: '#FF6600',
    fontSize: 11,
    fontWeight: '700',
    minWidth: 18,
    height: 18,
    lineHeight: 18,
  },
});
