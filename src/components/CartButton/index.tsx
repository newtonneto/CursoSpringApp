import React from 'react';
import { FAB } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

import { UseCart } from '../../hooks/cartProvider';
import colors from '../../template/colors';

const CartButton = (): React.ReactElement => {
  const { cart } = UseCart();
  const navigation = useNavigation();

  return (
    <>
      {cart.items.length ? (
        <FAB
          onPress={() => navigation.navigate('CartStack')}
          visible={true}
          icon={{
            type: 'materialcommunityicons',
            name: 'shopping-cart',
            color: 'white',
          }}
          color={colors.primary}
          placement="right"
        />
      ) : null}
    </>
  );
};

export default CartButton;
