import React, { useState, useEffect, useRef } from 'react';
import { Alert, FlatList, ListRenderItem } from 'react-native';
import Toast from 'react-native-toast-message';

import { SafeAreaView, Separator } from '../../template/styles';
import { CompraDTO } from '../../models/compra.dto';
import { UseService } from '../../hooks/serviceProvider';
import { errorToast } from '../../utils/toasts';
import { ApiError } from '../../exceptions/exceptions';
import { PageCompra } from '../../models/page';
import ItemPurchased from '../../components/ItemPurchased';
import Loader from '../../components/Loader';

const renderItem: ListRenderItem<CompraDTO> = ({ item }) => (
  <ItemPurchased purchase={item} />
);

const Purchases = (): React.ReactElement => {
  const { getPurchases } = UseService();
  const [purchases, setPurchases] = useState<CompraDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const isMounted = useRef<boolean>(true);
  const page = useRef<number>(0);
  const last = useRef<boolean>(false);

  useEffect(() => {
    getPurchasesData();

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPurchasesData = async (): Promise<void> => {
    if (!isMounted.current) {
      return;
    }
    setRefreshing(true);

    try {
      const list: PageCompra = await getPurchases();

      if (!isMounted.current) {
        return;
      }
      setPurchases([...purchases, ...list.content]);
      last.current = list.last;
      page.current++;
    } catch (err) {
      if (err instanceof ApiError) {
        Alert.alert(':(', `[${err.error.status}]: ${err.error.message}`);
      } else {
        errorToast('Erro de conexão');
      }

      console.log('getPurchasesData: ', err);
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
  };

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
            data={purchases}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingVertical: 32,
            }}
            ItemSeparatorComponent={Separator}
            refreshing={refreshing}
            onRefresh={getPurchasesData}
          />
        )}
      </SafeAreaView>
      <Toast />
    </>
  );
};

export default Purchases;
