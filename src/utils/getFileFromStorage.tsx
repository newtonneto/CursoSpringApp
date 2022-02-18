import {
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import { Alert } from 'react-native';

const getFileFromStorage = async (setPhoto: Function) => {
  const options: ImageLibraryOptions = {
    quality: 0.5,
    mediaType: 'photo',
  };

  const { assets } = await launchImageLibrary(options);

  if (assets) {
    setPhoto(assets[0].uri);
  } else {
    Alert.alert(':(', 'Não foi possível atualizar sua foto de usuário');
  }
};

export default getFileFromStorage;
