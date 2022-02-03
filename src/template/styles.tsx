import styled from 'styled-components/native';

import colors from './colors';

export const SafeAreaView = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.background};
`;

export const KeyboardAvoidingView = styled.KeyboardAvoidingView`
  flex: 1;
  background-color: ${colors.background};
`;

export const ScrollView = styled.ScrollView.attrs({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: {
    paddingHorizontal: 24,
    paddingTop: 16,
    alignItems: 'center',
  },
})`
  flex: 1;
  width: 100%;
`;

export const FlatList = styled.FlatList.attrs({
  showsVerticalScrollIndicator: false,
})`
  flex: 1;
`;
