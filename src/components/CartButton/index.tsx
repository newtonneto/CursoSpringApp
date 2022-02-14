import React from 'react';
import { FAB } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

const CartButton = (): React.ReactElement => {
  const navigation = useNavigation();

  return (
    <FAB
      onPress={() => navigation.navigate('CartStack')}
      visible={true}
      icon={{
        type: 'materialcommunityicons',
        name: 'shopping-cart',
        color: 'white',
      }}
      color="green"
      placement="right"
    />
  );
};

export default CartButton;
