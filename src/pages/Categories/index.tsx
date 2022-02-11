/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState, useRef } from 'react';
import { Alert } from 'react-native';
import { ListRenderItem, FlatList } from 'react-native';

import { SafeAreaView } from '../../template/styles';
import { CategoriaDTO } from '../../models/categoria.dto';
import { UseService } from '../../hooks/serviceProvider';
import Card from '../../components/Card';
import { ErrorTemplate } from '../../models/error';

const renderItem: ListRenderItem<CategoriaDTO> = ({ item }) => (
  <Card item={item} page="Products" />
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
    try {
      const list: CategoriaDTO[] = await findAllCategories();

      if (!isMounted.current) {
        return;
      }
      setCategories(list);
    } catch (err) {
      const error: ErrorTemplate = err as ErrorTemplate;

      Alert.alert(':(', `[${error.status}]: ${error.message}`);
      console.log('getCategories: ', err);
    }
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
