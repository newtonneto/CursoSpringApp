import React, { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { Card, Button, Icon, CheckBox } from 'react-native-elements';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Picker } from '@react-native-picker/picker';

import { SafeAreaView, ScrollView, Separator } from '../../template/styles';
import colors from '../../template/colors';
import { RootStackParamList } from '../../routes/app.routes';
import { UseCart } from '../../hooks/cartProvider';
import { CartItem } from '../../models/cart';
import { ItemPedido, PedidoDTO } from '../../models/pedido.dto';

type Props = NativeStackScreenProps<RootStackParamList, 'Checkout'>;

const Checkout = ({ route }: Props): React.ReactElement => {
  const { cart } = UseCart();
  const [checked, setChecked] = useState<number>(1);
  const [quota, setQuota] = useState<number>(1);
  const total = useRef<number>(0);

  useEffect(() => {
    let cart_total = 0;

    cart.items.forEach((item: CartItem): void => {
      cart_total += item.produto.preco * item.quantidade;
    });

    total.current = cart_total;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCheck = (type: number): void => {
    if (type === checked) {
      setChecked(0);
    } else {
      setChecked(type);
    }
  };

  const submit = async (): Promise<void> => {
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
  };

  return (
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
          <Text>Total: R$ {total.current}</Text>
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
            onPress={() => setQuota(1)}
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
            onPress={() => setQuota(2)}
          />
          {checked === 2 && (
            <Picker
              selectedValue={quota}
              onValueChange={setQuota}
              style={{ flex: 1, width: '100%' }}>
              <Picker.Item
                label={'1x'}
                value={1}
                key={1}
                color={colors.background}
              />
              <Picker.Item
                label={'2x'}
                value={2}
                key={2}
                color={colors.background}
              />
              <Picker.Item
                label={'3x'}
                value={3}
                key={3}
                color={colors.background}
              />
              <Picker.Item
                label={'4x'}
                value={4}
                key={4}
                color={colors.background}
              />
              <Picker.Item
                label={'5x'}
                value={5}
                key={5}
                color={colors.background}
              />
              <Picker.Item
                label={'6x'}
                value={6}
                key={6}
                color={colors.background}
              />
              <Picker.Item
                label={'7x'}
                value={7}
                key={7}
                color={colors.background}
              />
              <Picker.Item
                label={'8x'}
                value={8}
                key={8}
                color={colors.background}
              />
              <Picker.Item
                label={'9x'}
                value={9}
                key={9}
                color={colors.background}
              />
              <Picker.Item
                label={'10x'}
                value={10}
                key={10}
                color={colors.background}
              />
              <Picker.Item
                label={'11x'}
                value={11}
                key={11}
                color={colors.background}
              />
              <Picker.Item
                label={'12x'}
                value={12}
                key={12}
                color={colors.background}
              />
            </Picker>
          )}
          <Separator />
          <Button
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
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Checkout;
