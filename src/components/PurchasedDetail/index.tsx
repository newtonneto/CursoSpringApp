import React, { useEffect, useState, useRef } from 'react';
import { ListItem, Avatar } from 'react-native-elements';

import axios from 'axios';
import blank from '../../assets/product-blank.jpg';
import { ItemCompra } from '../../models/compra.dto';

type Props = {
  product: ItemCompra;
};

const PurchasedDetail = ({ product }: Props): React.ReactElement => {
  const [image, setImage] = useState<string>('');
  const isMounted = useRef<boolean>(true);

  useEffect(() => {
    getImage();

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getImage = async (): Promise<void> => {
    try {
      const image_url = `https://new2-curso-spring.s3.sa-east-1.amazonaws.com/prod${product.produto.id}-small.jpg`;

      await axios.get(image_url);

      if (!isMounted.current) {
        return;
      }
      setImage(image_url);
    } catch (err) {
      console.log('getImage: ', err);
    }
  };

  return (
    <ListItem
      hasTVPreferredFocus={undefined}
      tvParallaxProperties={undefined}
      containerStyle={{ borderRadius: 8 }}>
      <Avatar rounded source={image ? { uri: image } : blank} size="medium" />
      <ListItem.Content>
        <ListItem.Title>{product.produto.nome}</ListItem.Title>
        <ListItem.Subtitle>
          Preço:{' '}
          {product.produto.preco.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
        </ListItem.Subtitle>
        <ListItem.Subtitle>Quantidade: {product.quantidade}</ListItem.Subtitle>
        <ListItem.Subtitle>
          Subtotal:{' '}
          {product.subTotal.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

export default PurchasedDetail;
