import React from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import Toast from 'react-native-toast-message';

import { SafeAreaView } from '../../template/styles';
import { UseCart } from '../../hooks/cartProvider';
import { CartItem } from '../../models/cart';
import ItemInCart from '../../components/ItemInCart';

const renderItem: ListRenderItem<CartItem> = ({ item }) => (
  <ItemInCart item={item} />
);

const Cart = (): React.ReactElement => {
  const { cart } = UseCart();

  return (
    <>
      <SafeAreaView
        style={{
          elevation: -1,
        }}>
        <FlatList
          data={cart.items}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingVertical: 24 }}
        />
      </SafeAreaView>
      <Toast />
    </>
  );
};

export default Cart;
