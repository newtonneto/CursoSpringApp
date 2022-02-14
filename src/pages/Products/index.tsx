import React, { useEffect, useState, useRef } from 'react';
import { ListRenderItem, FlatList, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import { SafeAreaView } from '../../template/styles';
import { ProdutoDTO } from '../../models/produto.dto';
import { UseService } from '../../hooks/serviceProvider';
import Card from '../../components/Card';
import Loader from '../../components/Loader';
import { errorToast } from '../../utils/toasts';
import { ApiError } from '../../exceptions/exceptions';
import { RootStackParamList } from '../../routes/app.routes';
import CartButton from '../../components/CartButton';

type Props = NativeStackScreenProps<RootStackParamList, 'Products'>;

const renderItem: ListRenderItem<ProdutoDTO> = ({ item }) => (
  <Card item={item} page="Product" />
);

const Products = ({ route }: Props): React.ReactElement => {
  const { findProductsByCategory } = UseService();
  const [products, setProducts] = useState<ProdutoDTO[] | null>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const isMounted = useRef(true);

  useEffect(() => {
    getProducts();

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getProducts(): Promise<void> {
    if (!isMounted.current) {
      return;
    }
    setRefreshing(true);

    try {
      const list = await findProductsByCategory(route.params.id);

      if (!isMounted.current) {
        return;
      }
      setProducts(list);
    } catch (err) {
      if (err instanceof ApiError) {
        Alert.alert(':(', `[${err.error.status}]: ${err.error.message}`);
      } else {
        errorToast('Erro de conexão');
      }

      console.log('getProducts', err);
    } finally {
      if (!isMounted.current) {
        return;
      }
      setLoading(false);
      if (!isMounted.current) {
        return;
      }
      setRefreshing(false);
    }
  }

  return (
    <>
      <SafeAreaView
        style={{
          elevation: -1,
        }}>
        {loading ? (
          <Loader />
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingVertical: 24 }}
            refreshing={refreshing}
            onRefresh={getProducts}
          />
        )}
        <CartButton />
      </SafeAreaView>
      <Toast />
    </>
  );
};

export default Products;
