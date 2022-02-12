import React from 'react';
import { ListItem, Avatar } from 'react-native-elements';

import blank from '../../assets/product-blank.jpg';
import { CartItem } from '../../models/cart';

type Props = {
  item: CartItem;
};

const ItemInCart = ({ item }: Props): React.ReactElement => {
  return (
    <ListItem
      hasTVPreferredFocus={undefined}
      tvParallaxProperties={undefined}
      containerStyle={{
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 8,
        height: 80,
      }}>
      <Avatar rounded source={blank} />
      <ListItem.Content>
        <ListItem.Title>{item.produto.nome}</ListItem.Title>
        <ListItem.Subtitle>{item.produto.preco}</ListItem.Subtitle>
        <ListItem.Subtitle>{item.quantidade}</ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

export default ItemInCart;
