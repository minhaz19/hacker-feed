import type { NavigatorScreenParams } from '@react-navigation/native';
import type { Story } from './story';

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<RootTabParamList>;
  ArticleDetail: { story: Story };
};

export type RootTabParamList = {
  FeedTab: undefined;
  BookmarksTab: undefined;
};
