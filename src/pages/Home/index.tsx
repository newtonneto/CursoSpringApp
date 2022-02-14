import React from 'react';
import { Text } from 'react-native';
import colors from '../../template/colors';

import { KeyboardAvoidingView, ScrollView } from '../../template/styles';

const Home = (): React.ReactElement => {
  return (
    <KeyboardAvoidingView>
      <ScrollView>
        <Text style={{ color: colors.text }}>
          Não faço ideia do que colocar aqui
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Home;
