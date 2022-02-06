import { Alert } from 'react-native';

import api from '../api';
import { CategoriaDTO } from '../../models/categoria.dto';
import { ErrorTemplate } from '../../models/error';

export const findAll = async (): Promise<CategoriaDTO[] | null> => {
  try {
    const { data } = await api.get<CategoriaDTO[]>('categorias');

    return data;
  } catch (err) {
    const error: ErrorTemplate = err as ErrorTemplate;

    Alert.alert(':(', `[${error.status}]: ${error.message}`);
    console.log('findAll: ', err);

    return null;
  }
};
