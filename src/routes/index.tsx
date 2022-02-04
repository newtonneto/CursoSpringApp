import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import AppRoutes from './app.routes';

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  AppRoutes: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Routes = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="AppRoutes" component={AppRoutes} />
    </Stack.Navigator>
  );
};

export default Routes;
