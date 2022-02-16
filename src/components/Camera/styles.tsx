import styled from 'styled-components/native';

export const Button = styled.View`
  align-items: center;
  justify-content: center;
  width: 55px;
  height: 55px;
`;

export const TakePicture = styled(Button)`
  flex: 0;
  align-self: center;
  position: absolute;
  bottom: 20px;
`;

export const CloseCamera = styled(Button)`
  flex: 0;
  position: absolute;
  bottom: 20px;
  right: 20px;
`;

export const ChangeCamera = styled(Button)`
  flex: 0;
  position: absolute;
  bottom: 20px;
  left: 20px;
`;
