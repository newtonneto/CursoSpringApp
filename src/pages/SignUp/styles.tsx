import styled from 'styled-components/native';

import colors from '../../template/colors';

export const ErrorView = styled.View`
  flex: 1;
  width: 95%;
  justify-content: flex-start;
`;

export const ErrorText = styled.Text`
  font-size: 12px;
  font-weight: 400;
  color: ${colors.danger};
`;
