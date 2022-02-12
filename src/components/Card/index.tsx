import React, { useEffect, useState, useRef } from 'react';
import { ListItem, Avatar } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

import { CategoriaDTO } from '../../models/categoria.dto';
import { ProdutoDTO } from '../../models/produto.dto';
import colors from '../../template/colors';
import axios from 'axios';
import blank from '../../assets/product-blank.jpg';

type Props = {
  item: CategoriaDTO | ProdutoDTO;
  page: 'Products' | 'Product';
};

const Card = ({ item, page }: Props): React.ReactElement => {
  const navigation = useNavigation();
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
      let image_url = '';

      if (page === 'Products') {
        image_url = `https://new2-curso-spring.s3.sa-east-1.amazonaws.com/cat${item.id}.jpg`;
      } else if (page === 'Product') {
        image_url = `https://new2-curso-spring.s3.sa-east-1.amazonaws.com/prod${item.id}-small.jpg`;
      }

      await axios.get(image_url);

      setImage(image_url);
    } catch (err) {
      console.log('getImage: ', err);
    }
  };

  return (
    <ListItem
      onPress={() => navigation.navigate(page, { id: item.id })}
      hasTVPreferredFocus={undefined}
      tvParallaxProperties={undefined}
      containerStyle={{
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 8,
        height: 80,
      }}>
      <Avatar rounded source={image ? { uri: image } : blank} size="medium" />
      <ListItem.Content>
        <ListItem.Title>{item.nome}</ListItem.Title>
      </ListItem.Content>
      <ListItem.Chevron
        color={colors.primary}
        tvParallaxProperties={{ color: colors.primary }}
      />
    </ListItem>
  );
};

export default Card;
