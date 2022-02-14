import React from 'react';
import { ListItem } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

import { EnderecoDTO } from '../../models/endereco.dto';
import colors from '../../template/colors';

type Props = {
  item: EnderecoDTO;
  client_id: number;
};

const Address = ({ item, client_id }: Props): React.ReactElement => {
  const navigation = useNavigation();

  return (
    <ListItem
      onPress={() =>
        navigation.navigate('Checkout', { client_id: client_id, address: item })
      }
      hasTVPreferredFocus={undefined}
      tvParallaxProperties={undefined}
      containerStyle={{
        borderRadius: 8,
        flex: 1,
      }}>
      <ListItem.Content>
        <ListItem.Title>
          {item.logradouro}, {item.numero}
        </ListItem.Title>
        {item.complemento && (
          <ListItem.Subtitle>{item.complemento}</ListItem.Subtitle>
        )}
        <ListItem.Subtitle>
          {item.bairro}, {item.cep}
        </ListItem.Subtitle>
        <ListItem.Subtitle>
          {item.cidade.nome} - {item.cidade.estado?.nome}
        </ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron
        color={colors.primary}
        tvParallaxProperties={{ color: colors.primary }}
      />
    </ListItem>
  );
};

export default Address;
