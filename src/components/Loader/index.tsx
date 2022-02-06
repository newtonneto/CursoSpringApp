import React from 'react';
import { ActivityIndicator } from 'react-native';

import { Container } from './styles';
import colors from '../../template/colors';

const Loader = (): React.ReactElement => {
  return (
    <Container>
      <ActivityIndicator size="large" color={colors.primary} />
    </Container>
  );
};

export default Loader;
