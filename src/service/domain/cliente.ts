import { Alert } from 'react-native';

import api from '../api';
import { ClienteDTO } from '../../models/cliente.dto';
import { ErrorTemplate } from '../../models/error';

export const getByEmail = async (
  email: string,
  token: string,
): Promise<ClienteDTO | null> => {
  try {
    const { data } = await api.authorized_get<ClienteDTO>(
      `clientes/email?value=${email}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return data;
  } catch (err) {
    const error: ErrorTemplate = err as ErrorTemplate;

    Alert.alert(':(', `[${error.status}]: ${error.message}`);
    console.log('getByEmail: ', err);

    return null;
  }
};
