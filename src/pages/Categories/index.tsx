/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState, useRef } from 'react';
import { Alert, ListRenderItem, FlatList } from 'react-native';
import Toast from 'react-native-toast-message';

import { SafeAreaView, Separator } from '../../template/styles';
import { CategoriaDTO } from '../../models/categoria.dto';
import { UseService } from '../../hooks/serviceProvider';
import Card from '../../components/Card';
import { ApiError } from '../../exceptions/exceptions';
import { errorToast } from '../../utils/toasts';
import Loader from '../../components/Loader';
import CartButton from '../../components/CartButton';

const renderItem: ListRenderItem<CategoriaDTO> = ({ item }) => (
  <Card item={item} page="Products" />
);

const Categories = (): React.ReactElement => {
  const { findAllCategories } = UseService();
  const [categories, setCategories] = useState<CategoriaDTO[] | null>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const isMounted = useRef(true);

  useEffect(() => {
    getCategories();

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getCategories(): Promise<void> {
    if (!isMounted.current) {
      return;
    }
    setRefreshing(true);

    try {
      const list: CategoriaDTO[] = await findAllCategories();

      if (!isMounted.current) {
        return;
      }
      setCategories(list);
    } catch (err) {
      if (err instanceof ApiError) {
        Alert.alert(':(', `[${err.error.status}]: ${err.error.message}`);
      } else {
        errorToast('Erro de conexão');
      }

      console.log('getCategories: ', err);
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
            data={categories}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingVertical: 32,
            }}
            ItemSeparatorComponent={Separator}
            refreshing={refreshing}
            onRefresh={getCategories}
          />
        )}
        <CartButton />
      </SafeAreaView>
      <Toast />
    </>
  );
};

export default Categories;
