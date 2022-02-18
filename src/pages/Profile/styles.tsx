import styled from 'styled-components/native';

import colors from '../../template/colors';

export const AvatarContainer = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 8px 8px 8px;
`;

export const TitleContainer = styled.View`
  flex: 1;
  width: 100%;
  padding-right: 16px;
`;

export const Section = styled.TouchableOpacity`
  background-color: ${colors.text};
  width: 100%;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  padding: 16px 24px 16px 24px;
  flex-direction: row;
  align-items: center;
`;

export const SectionTitle = styled.Text`
  color: ${colors.background};
  font-weight: 600;
  font-size: 20px;
  margin-left: 16px;
`;

export const SectionContent = styled.View`
  background-color: ${colors.disabled};
  width: 100%;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  padding: 16px 24px 16px 24px;
`;

export const SectionItem = styled.Text`
  color: ${colors.background};
  font-weight: 400;
  font-size: 16px;
`;
