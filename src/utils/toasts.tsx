import Toast from 'react-native-toast-message';

export const errorToast = (message: string): void => {
  Toast.show({
    type: 'error',
    text1: '😭',
    text2: message,
  });
};

export const successToast = (message: string): void => {
  Toast.show({
    type: 'success',
    text1: '😁',
    text2: message,
  });
};
