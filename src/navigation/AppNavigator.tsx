import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import TabNavigator from './TabNavigator';
import { ArticleDetailScreen } from '../features/detail/ArticleDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Custom dark theme for React Navigation.
 * Provides a cohesive dark appearance across all navigation surfaces.
 */
const HackerFeedTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: '#FF6600',
    background: '#000000',
    card: '#1C1C1E',
    text: '#FFFFFF',
    border: '#2C2C2E',
    notification: '#FF6600',
  },
};

/**
 * Root Stack Navigator wrapping tabs + detail screen.
 * ArticleDetail lives here so it naturally covers the tab bar.
 */
const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer theme={HackerFeedTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#000000',
          },
          headerTintColor: '#FF6600',
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 17,
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: '#000000',
          },
        }}>
        <Stack.Screen
          name="MainTabs"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ArticleDetail"
          component={ArticleDetailScreen}
          options={{
            title: 'Article',
            headerBackTitle: 'Feed',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
