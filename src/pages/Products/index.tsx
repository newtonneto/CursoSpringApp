import React, { useEffect, useState, useRef } from 'react';
import { ListRenderItem, FlatList } from 'react-native';

import { SafeAreaView } from '../../template/styles';
import { ProdutoDTO } from '../../models/produto.dto';
import { UseService } from '../../hooks/serviceProvider';
import Card from '../../components/Card';
import Loader from '../../components/Loader';

const renderItem: ListRenderItem<ProdutoDTO> = ({ item }) => (
  <Card item={item} />
);

const Products = (): React.ReactElement => {
  const { findProductsByCategory } = UseService();
  const [products, setProducts] = useState<ProdutoDTO[] | null>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const isMounted = useRef(true);

  useEffect(() => {
    getProducts();

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getProducts(): Promise<void> {
    const list = await findProductsByCategory(1);

    console.log('list: ', list);

    if (!isMounted.current) {
      return;
    }
    setProducts(list);
    if (!isMounted.current) {
      return;
    }
    setLoading(false);
  }

  return (
    <SafeAreaView>
      {loading ? (
        <Loader />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
      )}
    </SafeAreaView>
  );
};

export default Products;
