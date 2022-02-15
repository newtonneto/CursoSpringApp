import React, { useEffect, useRef, useState } from 'react';
import { Text, View, Alert } from 'react-native';
import { Card, Button, Icon, CheckBox } from 'react-native-elements';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';

import { SafeAreaView, ScrollView, Separator } from '../../template/styles';
import colors from '../../template/colors';
import { RootStackParamList } from '../../routes/app.routes';
import { UseCart } from '../../hooks/cartProvider';
import { CartItem } from '../../models/cart';
import { ItemPedido, PedidoDTO } from '../../models/pedido.dto';
import { UseService } from '../../hooks/serviceProvider';
import { errorToast, successToast } from '../../utils/toasts';
import { ApiError } from '../../exceptions/exceptions';

type Props = NativeStackScreenProps<RootStackParamList, 'Checkout'>;

const Checkout = ({ route, navigation }: Props): React.ReactElement => {
  const { cart, createOrClearCart } = UseCart();
  const { purchase } = UseService();
  const [checked, setChecked] = useState<number>(1);
  const [quota, setQuota] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const isMounted = useRef<boolean>(true);

  useEffect(() => {
    let cart_total = 0;

    cart.items.forEach((item: CartItem): void => {
      cart_total += item.produto.preco * item.quantidade;
    });

    if (!isMounted.current) {
      return;
    }
    setTotal(cart_total);

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async (): Promise<void> => {
    if (!isMounted.current) {
      return;
    }
    setLoading(true);

    successToast('Pedido realizado com sucesso');

    try {
      const payload: PedidoDTO = {
        cliente: { id: route.params.client_id },
        enderecoDeEntrega: { id: route.params.address.id },
        pagamento: {
          numeroDeParcelas: checked === 2 ? quota : null,
          '@type': checked === 2 ? 'pagamentoComCartao' : 'pagamentoComBoleto',
        },
        itens: cart.items.map((item): ItemPedido => {
          return {
            quantidade: item.quantidade,
            produto: { id: item.produto.id },
          };
        }),
      };

      await purchase(payload);

      successToast('Pedido realizado com sucesso');

      await createOrClearCart();

      Alert.alert(':)', "Se pedido foi aceito, clique em 'OK' para voltar", [
        {
          text: 'OK',
          onPress: () =>
            navigation.navigate('ShoppingStack', { screen: 'Categories' }),
        },
      ]);
    } catch (err) {
      if (err instanceof ApiError) {
        Alert.alert(':(', `[${err.error.status}]: ${err.error.message}`);
      } else {
        errorToast('Erro de conexão');
      }

      console.log('submit: ', err);
    } finally {
      if (!isMounted.current) {
        return;
      }
      setLoading(false);
    }
  };

  return (
    <>
      <SafeAreaView
        style={{
          elevation: -1,
        }}>
        <ScrollView>
          <Card
            containerStyle={{
              flex: 1,
              borderRadius: 8,
              marginHorizontal: 0,
              marginVertical: 0,
              width: '100%',
            }}>
            <Card.Title>Endereço de entrega: </Card.Title>
            <Card.Divider />
            <View>
              <Text>
                {route.params.address.logradouro}, {route.params.address.numero}
              </Text>
              {route.params.address.complemento && (
                <Text>{route.params.address.complemento}</Text>
              )}
              <Text>
                {route.params.address.bairro}, {route.params.address.cep}
              </Text>
              <Text>
                {route.params.address.cidade.nome} -{' '}
                {route.params.address.cidade.estado?.nome}
              </Text>
              <Separator />
            </View>
            <Card.Title>Produtos: </Card.Title>
            <Card.Divider />
            {cart.items.map((item: CartItem, index: number) => (
              <View key={index}>
                <Text>
                  {item.quantidade}x {item.produto.nome} - R${' '}
                  {item.quantidade * item.produto.preco}
                </Text>
              </View>
            ))}
            <Separator />
            <Text>
              Total:{' '}
              {total.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </Text>
            <Separator />
            <Card.Title>Forma de pagamento: </Card.Title>
            <Card.Divider />
            <CheckBox
              title="Boleto"
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checked={checked === 1}
              containerStyle={{
                marginVertical: 0,
                borderWidth: 0,
                marginLeft: 0,
                marginRight: 0,
                backgroundColor: colors.text,
              }}
              onPress={() => setChecked(1)}
            />
            <CheckBox
              title="Cartão de credito"
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checked={checked === 2}
              containerStyle={{
                marginVertical: 0,
                borderWidth: 0,
                marginLeft: 0,
                marginRight: 0,
                backgroundColor: colors.text,
              }}
              onPress={() => setChecked(2)}
            />
            {checked === 2 && (
              <Picker
                selectedValue={quota}
                onValueChange={setQuota}
                style={{
                  flex: 1,
                  width: '100%',
                }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(
                  (item: number): JSX.Element => (
                    <Picker.Item
                      label={`${item}x ${(total / item).toLocaleString(
                        'pt-BR',
                        {
                          style: 'currency',
                          currency: 'BRL',
                        },
                      )}`}
                      value={item}
                      key={item}
                      color={colors.background}
                    />
                  ),
                )}
              </Picker>
            )}
            <Separator />
            <Button
              disabled={loading}
              icon={
                <Icon
                  type="materialcommunityicons"
                  name="shopping-cart"
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
                backgroundColor: colors.success,
              }}
              title="FINALIZAR COMPRA"
              onPress={submit}
            />
          </Card>
        </ScrollView>
      </SafeAreaView>
      <Toast />
    </>
  );
};

export default Checkout;
