import React, { useEffect, useState, useRef } from 'react';
import { FlatList, Alert, ListRenderItem, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text } from 'react-native-elements';
import Toast from 'react-native-toast-message';

import { SafeAreaView, Separator } from '../../template/styles';
import { RootStackParamList } from '../../routes/app.routes';
import Loader from '../../components/Loader';
import { errorToast } from '../../utils/toasts';
import { UseService } from '../../hooks/serviceProvider';
import { ApiError } from '../../exceptions/exceptions';
import { CompraDTO, ItemCompra } from '../../models/compra.dto';
import PurchasedDetail from '../../components/PurchasedDetail';
import colors from '../../template/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Purchase'>;

const renderItem: ListRenderItem<ItemCompra> = ({ item }) => (
  <PurchasedDetail product={item} />
);

const Purchase = ({ route }: Props): React.ReactElement => {
  const { getPurchase } = UseService();
  const [purchasedItems, setPurchasedItems] = useState<CompraDTO>(
    {} as CompraDTO,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const isMounted = useRef<boolean>(true);

  useEffect(() => {
    const getPurchaseData = async (): Promise<void> => {
      try {
        const data: CompraDTO = await getPurchase(route.params.purchase_id);

        setPurchasedItems(data);
      } catch (err) {
        if (err instanceof ApiError) {
          Alert.alert(':(', `[${err.error.status}]: ${err.error.message}`);
        } else {
          errorToast('Erro de conexão');
        }

        console.log('getPurchaseData', err);
      } finally {
        if (!isMounted.current) {
          return;
        }
        setLoading(false);
      }
    };

    getPurchaseData();

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const headerComponent = (): React.ReactElement => (
    <View style={{ flex: 1, alignItems: 'flex-end' }}>
      <Text h4 style={{ color: colors.text }}>
        Total do carrinho:{' '}
        {purchasedItems.valorTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })}
      </Text>
      <Separator />
    </View>
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
            data={purchasedItems.itens}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingVertical: 32,
            }}
            ItemSeparatorComponent={Separator}
            ListHeaderComponent={headerComponent}
          />
        )}
      </SafeAreaView>
      <Toast />
    </>
  );
};

export default Purchase;
