import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import Home from '../pages/Home';
import Categories from '../pages/Categories';

const Drawer = createDrawerNavigator();

const AppRoutes = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Categorias" component={Categories} />
    </Drawer.Navigator>
  );
};

export default AppRoutes;
