/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View } from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from '../pages/Home';
import Categories from '../pages/Categories';
import Products from '../pages/Products';
import Profile from '../pages/Profile';
import { UseAuth } from '../hooks/authProvider';
import colors from '../template/colors';

export type RootStackParamList = {
  Categories: undefined;
  Products: undefined;
  Product: undefined;
};

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

const CategoriesStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Categories" component={Categories} />
      <Stack.Screen name="Products" component={Products} />
    </Stack.Navigator>
  );
};

const AppRoutes = () => {
  const { logout } = UseAuth();

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={props => {
        return (
          <DrawerContentScrollView
            {...props}
            contentContainerStyle={{
              flex: 1,
              justifyContent: 'space-between',
            }}>
            <View style={{ justifyContent: 'flex-start' }}>
              <DrawerItemList {...props} />
            </View>
            <DrawerItem
              label="Sair"
              onPress={() => logout()}
              inactiveTintColor={colors.danger}
              style={{ marginBottom: 32 }}
            />
          </DrawerContentScrollView>
        );
      }}>
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Categorias" component={CategoriesStack} />
      <Drawer.Screen name="Perfil" component={Profile} />
    </Drawer.Navigator>
  );
};

export default AppRoutes;
