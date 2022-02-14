import React from 'react';
import { ListItem } from 'react-native-elements';

import { EnderecoDTO } from '../../models/endereco.dto';
import colors from '../../template/colors';

type Props = {
  item: EnderecoDTO;
};

const Address = ({ item }: Props): React.ReactElement => {
  return (
    <ListItem
      hasTVPreferredFocus={undefined}
      tvParallaxProperties={undefined}
      containerStyle={{
        borderRadius: 8,
        height: 80,
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
          {item.cidade.nome} - {item.cidade.estado}
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
