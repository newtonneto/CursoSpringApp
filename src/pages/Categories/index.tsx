import React, { useEffect, useState, useRef } from 'react';
import { ListRenderItem } from 'react-native';
import { Card } from 'react-native-elements';

import { SafeAreaView, FlatList } from '../../template/styles';
import { CategoriaDTO } from '../../models/categoria.dto';
import { findAll } from '../../service/domain/categoria';

const renderItem: ListRenderItem<CategoriaDTO> = ({ item }) => (
  <Card>
    <Card.Title>{item.nome}</Card.Title>
  </Card>
);

function Categories() {
  const [categories, setCategories] = useState<CategoriaDTO[]>([]);
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
    setCategories(list || []);
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
}

export default Categories;
