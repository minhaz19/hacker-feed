/* eslint-disable no-undef */

/**
 * Jest setup file.
 */

// Mock react-native-mmkv
jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn().mockImplementation(() => ({
    getString: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
  })),
}));

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native').View;
  return {
    GestureHandlerRootView: View,
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    PanGestureHandler: View,
    TapGestureHandler: View,
    FlingGestureHandler: View,
    ForceTouchGestureHandler: View,
    LongPressGestureHandler: View,
    NativeViewGestureHandler: View,
    RotationGestureHandler: View,
    ScrollView: require('react-native').ScrollView,
    Slider: require('react-native').View,
    Switch: require('react-native').Switch,
    TextInput: require('react-native').TextInput,
    ToolbarAndroid: require('react-native').View,
    TouchableHighlight: require('react-native').TouchableHighlight,
    TouchableNativeFeedback: require('react-native').TouchableNativeFeedback,
    TouchableOpacity: require('react-native').TouchableOpacity,
    TouchableWithoutFeedback: require('react-native').TouchableWithoutFeedback,
    Directions: {},
  };
});

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock @react-native-community/netinfo
jest.mock('@react-native-community/netinfo', () => ({
  default: {
    addEventListener: jest.fn(() => jest.fn()),
    fetch: jest.fn().mockResolvedValue({
      isConnected: true,
      isInternetReachable: true,
    }),
  },
}));

// Mock react-native-screens
jest.mock('react-native-screens', () => {
  const View = require('react-native').View;
  return {
    enableScreens: jest.fn(),
    Screen: View,
    ScreenContainer: View,
    ScreenStack: View,
    ScreenStackHeaderConfig: View,
    ScreenStackHeaderSubview: View,
    ScreenStackHeaderBackButtonImage: View,
    ScreenStackHeaderRightView: View,
    ScreenStackHeaderLeftView: View,
    ScreenStackHeaderTitleView: View,
    ScreenStackHeaderCenterView: View,
    ScreenStackHeaderSearchBarView: View,
    SearchBarCommands: {},
    NativeScreen: View,
    NativeScreenContainer: View,
    NativeScreenNavigationContainer: View,
    useTransitionProgress: jest.fn(),
  };
});

// Silence specific warnings in tests
jest.spyOn(console, 'warn').mockImplementation((...args) => {
  const message = typeof args[0] === 'string' ? args[0] : '';
  if (message.includes('Animated:')) {
    return;
  }
});
