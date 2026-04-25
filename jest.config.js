module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['./jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|react-native-mmkv|react-native-gesture-handler|react-native-reanimated|react-native-screens|react-native-safe-area-context|@react-native-community/netinfo)/)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
};
