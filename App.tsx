import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { AppNavigator } from '@/navigation';

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={styles.root}>
      <AppNavigator />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
  },
});

export default App;
