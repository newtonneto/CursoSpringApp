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
import Product from '../pages/Product';
import Cart from '../pages/Cart';
import SelectAddress from '../pages/SelectAddress';
import Checkout from '../pages/Checkout';
import Profile from '../pages/Profile';
import { UseAuth } from '../hooks/authProvider';
import colors from '../template/colors';
import { EnderecoDTO } from '../models/endereco.dto';

export type RootStackParamList = {
  Categories: undefined;
  Products: { id: number };
  Product: { id: number };
  CartStack: undefined;
  Cart: undefined;
  SelectAddress: undefined;
  Checkout: { client_id: number; address: EnderecoDTO };
  ShoppingStack: { screen: string };
};

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

const CartStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Cart" component={Cart} />
      <Stack.Screen name="SelectAddress" component={SelectAddress} />
      <Stack.Screen name="Checkout" component={Checkout} />
      <Stack.Screen name="ShoppingStack" component={ShoppingStack} />
    </Stack.Navigator>
  );
};

const ShoppingStack = () => {
  return (
    <>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Categories" component={Categories} />
        <Stack.Screen name="Products" component={Products} />
        <Stack.Screen name="Product" component={Product} />
        <Stack.Screen name="CartStack" component={CartStack} />
      </Stack.Navigator>
    </>
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
      <Drawer.Screen name="Shopping" component={ShoppingStack} />
      <Drawer.Screen name="Carrinho" component={CartStack} />
      <Drawer.Screen name="Perfil" component={Profile} />
    </Drawer.Navigator>
  );
};

export default AppRoutes;
