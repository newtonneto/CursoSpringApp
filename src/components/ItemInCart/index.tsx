import React from 'react';
import { ListItem, Avatar } from 'react-native-elements';

import blank from '../../assets/product-blank.jpg';
import { UseCart } from '../../hooks/cartProvider';
import { CartItem } from '../../models/cart';

type Props = {
  item: CartItem;
};

const ItemInCart = ({ item }: Props): React.ReactElement => {
  const { insertProduct, removeProduct } = UseCart();

  const handleQuantity = (index: number): void => {
    if (index === 0) {
      addQuantity();
    } else {
      removeQuantity();
    }
  };

  const addQuantity = async (): Promise<void> => {
    await insertProduct(item.produto);
  };

  const removeQuantity = async (): Promise<void> => {
    await removeProduct(item.produto);
  };

  return (
    <ListItem
      hasTVPreferredFocus={undefined}
      tvParallaxProperties={undefined}
      containerStyle={{
        flex: 1,
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 8,
      }}>
      <Avatar rounded source={blank} />
      <ListItem.Content>
        <ListItem.Title>{item.produto.nome}</ListItem.Title>
        <ListItem.Subtitle>Preço: R$ {item.produto.preco}</ListItem.Subtitle>
        <ListItem.Subtitle>Quantidade: {item.quantidade}</ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.ButtonGroup
        buttons={['+', '-']}
        onPress={(index: number): void => handleQuantity(index)}
      />
    </ListItem>
  );
};

export default ItemInCart;
