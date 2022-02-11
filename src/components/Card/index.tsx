import React from 'react';
import { ListItem, Avatar } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

import { CategoriaDTO } from '../../models/categoria.dto';
import { ProdutoDTO } from '../../models/produto.dto';
import colors from '../../template/colors';

type Props = {
  item: CategoriaDTO | ProdutoDTO;
  page: 'Products' | 'Product';
};

const Card = ({ item, page }: Props): React.ReactElement => {
  const navigation = useNavigation();

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
      <Avatar
        rounded
        source={{
          uri: `https://new2-curso-spring.s3.sa-east-1.amazonaws.com/cat${item.id}.jpg`,
        }}
        size="medium"
      />
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
