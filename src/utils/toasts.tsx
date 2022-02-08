import Toast from 'react-native-toast-message';

export const invalidCEPToast = (): void => {
  Toast.show({
    type: 'error',
    text1: ':(',
    text2: 'CEP inválido',
  });
};

export const connectionErrorToast = (): void => {
  Toast.show({
    type: 'error',
    text1: ':(',
    text2: 'Erro de conexão',
  });
};
