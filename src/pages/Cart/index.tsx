import React, { useState, useEffect } from 'react';
import { FlatList, ListRenderItem, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { Text, Button } from 'react-native-elements';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { SafeAreaView, Separator } from '../../template/styles';
import { UseCart } from '../../hooks/cartProvider';
import { CartItem } from '../../models/cart';
import ItemInCart from '../../components/ItemInCart';
import colors from '../../template/colors';
import { RootStackParamList } from '../../routes/app.routes';

type Props = NativeStackScreenProps<RootStackParamList, 'Products'>;

const renderItem: ListRenderItem<CartItem> = ({ item }) => (
  <ItemInCart item={item} />
);

const Cart = ({ navigation }: Props): React.ReactElement => {
  const { cart } = UseCart();
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    let cart_total = 0;

    cart.items.forEach((item: CartItem): void => {
      cart_total += item.produto.preco * item.quantidade;
    });

    setTotal(cart_total);
  }, [cart]);

  const headerComponent = (): React.ReactElement => (
    <View style={{ flex: 1, alignItems: 'flex-end' }}>
      <Text h4 style={{ color: colors.text }}>
        Total do carrinho:{' '}
        {total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })}
      </Text>
      <Separator />
    </View>
  );

  const footerComponent = (): React.ReactElement => (
    <View style={{ flex: 1 }}>
      <Separator />
      <Button
        title="CONTINUAR COMPRANDO"
        buttonStyle={{
          borderColor: colors.text,
        }}
        type="outline"
        titleStyle={{ color: colors.text }}
        containerStyle={{
          width: '100%',
          marginVertical: 0,
        }}
        onPress={() => navigation.navigate('Categories')}
      />
      <Separator />
      <Button
        title="CONTINUAR PARA PAGAMENTO"
        buttonStyle={{
          backgroundColor: colors.success,
          borderRadius: 5,
        }}
        titleStyle={{ color: colors.text }}
        containerStyle={{
          width: '100%',
          marginVertical: 0,
        }}
        onPress={() => navigation.navigate('SelectAddress')}
      />
    </View>
  );

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
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingVertical: 32,
          }}
          ItemSeparatorComponent={Separator}
          ListHeaderComponent={headerComponent}
          ListFooterComponent={cart.items.length ? footerComponent : null}
        />
      </SafeAreaView>
      <Toast />
    </>
  );
};

export default Cart;
