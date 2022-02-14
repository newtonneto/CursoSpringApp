import React, { useState, useEffect, useRef } from 'react';
import { ListItem, Avatar } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

import blank from '../../assets/product-blank.jpg';
import { UseCart } from '../../hooks/cartProvider';
import { CartItem } from '../../models/cart';
import colors from '../../template/colors';

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
  <MaterialCommunityIcons
    name="trash-can-outline"
    size={16}
    color={colors.danger}
  />
);

const ItemInCart = ({ item }: Props): React.ReactElement => {
  const { insertProduct, removeProduct, totalRemove } = UseCart();
  const [image, setImage] = useState<string>('');
  const isMounted = useRef<boolean>(true);
  const buttons = [
    { element: AddButton },
    { element: MinusButton },
    { element: RemoveButton },
  ];

  useEffect(() => {
    getImage();

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const getImage = async (): Promise<void> => {
    try {
      await axios.get(
        `https://new2-curso-spring.s3.sa-east-1.amazonaws.com/prod${item.produto.id}-small.jpg`,
      );

      if (!isMounted.current) {
        return;
      }
      setImage(
        `https://new2-curso-spring.s3.sa-east-1.amazonaws.com/prod${item.produto.id}-small.jpg`,
      );
    } catch (err) {
      console.log('getImage: ', err);
    }
  };

  return (
    <ListItem
      hasTVPreferredFocus={undefined}
      tvParallaxProperties={undefined}
      containerStyle={{ flex: 1, borderRadius: 8 }}>
      <Avatar rounded source={image ? { uri: image } : blank} size="medium" />
      <ListItem.Content>
        <ListItem.Title>{item.produto.nome}</ListItem.Title>
        <ListItem.Subtitle>Preço: R$ {item.produto.preco}</ListItem.Subtitle>
        <ListItem.Subtitle>Quantidade: {item.quantidade}</ListItem.Subtitle>
        <ListItem.Subtitle>
          Subtotal: {item.quantidade * item.produto.preco}
        </ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.ButtonGroup
        buttons={buttons}
        onPress={(index: number): void => handleQuantity(index)}
      />
    </ListItem>
  );
};

export default ItemInCart;
