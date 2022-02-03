import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import App from './App';

const Index = () => {
  return (
    <SafeAreaProvider>
      <App />
    </SafeAreaProvider>
  );
};

export default Index;
