import React, { useEffect, useState, useRef } from 'react';
import { Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Card, Button, Icon, Text } from 'react-native-elements';
import Toast from 'react-native-toast-message';

import Loader from '../../components/Loader';
import { RootStackParamList } from '../../routes/app.routes';
import { UseService } from '../../hooks/serviceProvider';
import { SafeAreaView, ScrollView } from '../../template/styles';
import { ProdutoDTO } from '../../models/produto.dto';
import { ApiError } from '../../exceptions/exceptions';
import { errorToast } from '../../utils/toasts';

type Props = NativeStackScreenProps<RootStackParamList, 'Product'>;

const Product = ({ route }: Props): React.ReactElement => {
  const { getProductById } = UseService();
  const [product, setProduct] = useState<ProdutoDTO>({} as ProdutoDTO);
  const [loading, setLoading] = useState<boolean>(true);
  const isMounted = useRef<boolean>(true);

  useEffect(() => {
    const getProductData = async (): Promise<void> => {
      try {
        const data: ProdutoDTO = await getProductById(route.params.id);

        if (!isMounted.current) {
          return;
        }
        setProduct(data);
      } catch (err) {
        if (err instanceof ApiError) {
          Alert.alert(':(', `[${err.error.status}]: ${err.error.message}`);
        } else {
          errorToast('Erro de conexão');
        }

        console.log('getProductData: ', err);
      } finally {
        if (!isMounted.current) {
          return;
        }
        setLoading(false);
      }
    };

    getProductData();

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <SafeAreaView
        style={{
          elevation: -1,
        }}>
        <ScrollView>
          {loading ? (
            <Loader />
          ) : (
            <Card>
              <Card.Title>{product.nome}</Card.Title>
              <Card.Divider />
              <Card.Image
                style={{ padding: 0 }}
                source={{
                  uri: 'https://awildgeographer.files.wordpress.com/2015/02/john_muir_glacier.jpg',
                }}
              />
              <Text style={{ marginBottom: 10 }}>
                The idea with React Native Elements is more about component
                structure than actual design.
              </Text>
              <Button
                icon={
                  <Icon
                    type="materialcommunityicons"
                    name="add-shopping-cart"
                    color="#ffffff"
                    iconStyle={{ marginRight: 10 }}
                    tvParallaxProperties={undefined}
                  />
                }
                buttonStyle={{
                  borderRadius: 0,
                  marginLeft: 0,
                  marginRight: 0,
                  marginBottom: 0,
                }}
                title="VIEW NOW"
              />
            </Card>
          )}
        </ScrollView>
      </SafeAreaView>
      <Toast />
    </>
  );
};

export default Product;
