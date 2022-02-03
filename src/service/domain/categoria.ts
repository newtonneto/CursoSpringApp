import { Alert } from 'react-native';
import api from '../api';
import { CategoriaDTO } from '../../models/categoria.dto';

export const findAll = async () => {
  try {
    const { data } = await api.get<CategoriaDTO[]>('categorias');

    return data;
  } catch (err) {
    console.log('findAll: ', err);
    Alert.alert(':(', 'Erro');
  }
};
