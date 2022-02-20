import React from 'react';
import { View } from 'react-native';
import { ListItem, Divider } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

import { CompraDTO, ItemCompra } from '../../models/compra.dto';

type Props = {
  purchase: CompraDTO;
};

const ItemPurchased = ({ purchase }: Props): React.ReactElement => {
  const navigation = useNavigation();

  return (
    <ListItem
      onPress={() =>
        navigation.navigate('Purchase', { purchase_id: purchase.id })
      }
      hasTVPreferredFocus={undefined}
      tvParallaxProperties={undefined}
      containerStyle={{ flex: 1, borderRadius: 8 }}>
      <ListItem.Content>
        <ListItem.Title>Data: {purchase.instante}</ListItem.Title>
        {purchase.itens.map(
          (item: ItemCompra, index: number): React.ReactElement => (
            <View key={index} style={{ width: '100%' }}>
              <ListItem.Subtitle style={{ marginTop: 8, marginBottom: 8 }}>
                Item: {item.quantidade}x {item.produto.nome}
              </ListItem.Subtitle>
              <Divider />
            </View>
          ),
        )}
        <ListItem.Subtitle style={{ marginTop: 8 }}>
          Total: {purchase.valorTotal}
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

export default ItemPurchased;
