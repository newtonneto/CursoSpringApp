import React, { useEffect, useState, useRef } from 'react';
import { Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Card, Button, Icon, Text } from 'react-native-elements';
import Toast from 'react-native-toast-message';
import axios from 'axios';

import Loader from '../../components/Loader';
import { RootStackParamList } from '../../routes/app.routes';
import { UseService } from '../../hooks/serviceProvider';
import { SafeAreaView, ScrollView } from '../../template/styles';
import { ProdutoDTO } from '../../models/produto.dto';
import { ApiError } from '../../exceptions/exceptions';
import { errorToast } from '../../utils/toasts';
import blank from '../../assets/product-blank.jpg';
import colors from '../../template/colors';

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

        await getProductImage(data.id);
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

  const getProductImage = async (id: number): Promise<void> => {
    try {
      await axios.get(
        `https://new2-curso-spring.s3.sa-east-1.amazonaws.com/prod${id}.jpg`,
      );

      setProduct(prevState => ({
        ...(prevState as ProdutoDTO),
        imageUrl: `https://new2-curso-spring.s3.sa-east-1.amazonaws.com/prod${id}.jpg`,
      }));
    } catch (err) {
      console.log('getProductImage: ', err);
    }
  };

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
            <Card containerStyle={{ width: '95%' }}>
              <Card.Title>{product.nome}</Card.Title>
              <Card.Divider />
              <Card.Image
                style={{ padding: 0 }}
                source={product.imageUrl ? { uri: product.imageUrl } : blank}
              />
              <Text h3 style={{ marginVertical: 10 }}>
                R$ {product.preco}
              </Text>
              <Text style={{ marginVertical: 10 }}>
                Descrição do Produto:{'\n'}
                {'\n'}
                -Filhos de Gondor, de Rohan, meus irmãos;{'\n'}
                -Vejo em seus olhos o mesmo medo que tomou meu coração;{'\n'}
                -Poderá vir um dia em que a coragem dos homens termine, quando
                desertarmos nossos amigos e trairmos os laços de amizade;{'\n'}
                -Mas este dia não é hoje;{'\n'}
                -Uma hora de lobos e escudos despedaçados, quando a era dos
                homens for destruída;{'\n'}
                -Mas este dia não é hoje;{'\n'}
                -Hoje nós lutamos!;{'\n'}
                -Por tudo que amam nesta bela terra, eu peço que resistam,
                homens do ocidente!;{'\n'}
                {'\n'}
                -POR FRODO!
              </Text>
              <Button
                icon={
                  <Icon
                    type="materialcommunityicons"
                    name="add-shopping-cart"
                    color={colors.text}
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
                title="Adicionar ao Carrinho"
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
