/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState, useRef } from 'react';
import { ListRenderItem, FlatList } from 'react-native';

import { SafeAreaView } from '../../template/styles';
import { CategoriaDTO } from '../../models/categoria.dto';
import { UseService } from '../../hooks/serviceProvider';
import Card from '../../components/Card';

const renderItem: ListRenderItem<CategoriaDTO> = ({ item }) => (
  <Card item={item} />
);

const Categories = (): React.ReactElement => {
  const { findAllCategories } = UseService();
  const [categories, setCategories] = useState<CategoriaDTO[] | null>([]);
  const isMounted = useRef(true);

  useEffect(() => {
    getCategories();

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getCategories(): Promise<void> {
    const list = await findAllCategories();

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
