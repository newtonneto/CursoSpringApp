import 'react-native-gesture-handler';
import { LogBox } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import App from './App';
import AppProvider from './hooks';

const Index = () => {
  LogBox.ignoreLogs([
    "[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!",
  ]);

  return (
    <NavigationContainer>
      <AppProvider>
        <App />
      </AppProvider>
    </NavigationContainer>
  );
};

export default Index;
