/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState, useRef } from 'react';
import { ListRenderItem, FlatList } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';

import { SafeAreaView } from '../../template/styles';
import { CategoriaDTO } from '../../models/categoria.dto';
import { findAll } from '../../service/domain/categoria';
import colors from '../../template/colors';

const renderItem: ListRenderItem<CategoriaDTO> = ({ item }) => (
  <ListItem
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

const Categories = (): React.ReactElement => {
  const [categories, setCategories] = useState<CategoriaDTO[] | null>([]);
  const isMounted = useRef(true);

  useEffect(() => {
    getCategories();

    return () => {
      isMounted.current = false;
    };
  }, []);

  async function getCategories(): Promise<void> {
    const list = await findAll();

    if (!isMounted.current) {
      return;
    }
    setCategories(list);
  }

  return (
    <SafeAreaView>
      <FlatList
        data={categories}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

export default Categories;
