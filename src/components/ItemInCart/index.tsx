import React from 'react';
import { ListItem, Avatar } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import blank from '../../assets/product-blank.jpg';
import { UseCart } from '../../hooks/cartProvider';
import { CartItem } from '../../models/cart';

type Props = {
  item: CartItem;
};

const AddButton = (): React.ReactElement => (
  <MaterialCommunityIcons name="plus" size={16} />
);
const MinusButton = (): React.ReactElement => (
  <MaterialCommunityIcons name="minus" size={16} />
);
const RemoveButton = (): React.ReactElement => (
  <MaterialCommunityIcons name="trash-can-outline" size={16} />
);

const ItemInCart = ({ item }: Props): React.ReactElement => {
  const { insertProduct, removeProduct, totalRemove } = UseCart();
  const buttons = [
    { element: AddButton },
    { element: MinusButton },
    { element: RemoveButton },
  ];

  const handleQuantity = (index: number): void => {
    if (index === 0) {
      addQuantity();
    } else if (index === 1) {
      removeQuantity();
    } else {
      removeAll();
    }
  };

  const addQuantity = async (): Promise<void> => {
    await insertProduct(item.produto);
  };

  const removeQuantity = async (): Promise<void> => {
    await removeProduct(item.produto);
  };

  const removeAll = async (): Promise<void> => {
    await totalRemove(item.produto);
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
        buttons={buttons}
        onPress={(index: number): void => handleQuantity(index)}
      />
    </ListItem>
  );
};

export default ItemInCart;
