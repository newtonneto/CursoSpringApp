import React, { useEffect, useState, useRef } from 'react';
import {
  ListRenderItem,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import { FooterView } from './styles';
import { SafeAreaView, Separator } from '../../template/styles';
import { ProdutoDTO } from '../../models/produto.dto';
import { UseService } from '../../hooks/serviceProvider';
import Card from '../../components/Card';
import Loader from '../../components/Loader';
import { errorToast } from '../../utils/toasts';
import { ApiError } from '../../exceptions/exceptions';
import { RootStackParamList } from '../../routes/app.routes';
import CartButton from '../../components/CartButton';
import { Page } from '../../models/page';
import colors from '../../template/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Products'>;

const renderItem: ListRenderItem<ProdutoDTO> = ({ item }) => (
  <Card item={item} page="Product" />
);

const Products = ({ route }: Props): React.ReactElement => {
  const { findProductsByCategory } = UseService();
  const [products, setProducts] = useState<ProdutoDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [infinityLoading, setInfinityLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const isMounted = useRef<boolean>(true);
  const page = useRef<number>(0);
  const last = useRef<boolean>(false);

  useEffect(() => {
    getProducts();

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getProducts = async (): Promise<void> => {
    try {
      const list: Page = await findProductsByCategory(
        route.params.id,
        page.current,
      );

      if (!isMounted.current) {
        return;
      }
      setProducts([...products, ...list.content]);
      last.current = list.last;
      page.current++;
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
    }
  };

  const refreshList = async () => {
    page.current = 0;
    if (!isMounted.current) {
      return;
    }
    setRefreshing(true);

    await getProducts();

    if (!isMounted.current) {
      return;
    }
    setRefreshing(false);
  };

  const infinityList = async () => {
    if (!last.current) {
      if (!isMounted.current) {
        return;
      }
      setInfinityLoading(true);

      await getProducts();

      if (!isMounted.current) {
        return;
      }
      setInfinityLoading(false);
    }
  };

  const footerComponent = () => (
    <FooterView>
      {infinityLoading && (
        <ActivityIndicator size="small" color={colors.text} />
      )}
    </FooterView>
  );

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
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingVertical: 32,
            }}
            ListFooterComponent={footerComponent}
            ItemSeparatorComponent={Separator}
            refreshing={refreshing}
            onRefresh={refreshList}
            onEndReached={infinityList}
            onEndReachedThreshold={0.1}
          />
        )}
        <CartButton />
      </SafeAreaView>
      <Toast />
    </>
  );
};

export default Products;
