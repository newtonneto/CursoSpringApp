import React, { createContext, useContext, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import axios, { AxiosResponse } from 'axios';

import { UseAuth } from './authProvider';
import { ErrorTemplate } from '../models/error';
import { ClienteDTO } from '../models/cliente.dto';
import { CategoriaDTO } from '../models/categoria.dto';

interface ApiHandler {
  get<T>(url: string): Promise<AxiosResponse<T>>;
  post<T, U>(url: string, payload: T): Promise<AxiosResponse<U>>;
}

type Props = {
  children: React.ReactNode;
};

type ReturnContext = {
  findAllCategories: Function;
  getUserByEmail: Function;
};

const ServiceContext = createContext<ReturnContext | undefined>(undefined);

const ServiceProvider = ({ children }: Props) => {
  const { email, token, logout, loading, handlerToken } = UseAuth();
  const isMounted = useRef<boolean>(true);

  useEffect(() => {
    if (!loading) {
      initializer();
    }

    return (): void => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const initializer = async (): Promise<void> => {
    try {
      await refreshToken();
    } catch (err) {
      await logout();
    }
  };

  const client = axios.create({
    //baseURL: 'http://localhost:8080/',
    baseURL: 'https://new2-curso-spring.herokuapp.com/',
  });

  const api: ApiHandler = {
    get: async url => {
      return client.get(url);
    },
    post: async (url, payload) => {
      return client.post(url, payload);
    },
  };

  client.interceptors.request.use(
    async function (config) {
      config.headers!.Authorization = `Bearer ${token}`;

      return config;
    },
    function (error) {
      return Promise.reject(error);
    },
  );

  client.interceptors.response.use(
    function (response) {
      return response;
    },
    async function ({ response }): Promise<ErrorTemplate> {
      let error: ErrorTemplate = response.data;

      if (error.status === 403) {
        logout();
      }

      return Promise.reject(error);
    },
  );

  const refreshToken = async () => {
    try {
      const { headers } = await api.post('auth/refresh_token', {});

      handlerToken(headers.authorization);
    } catch (err) {
      console.log(err);
      logout();
    }
  };

  const findAllCategories = async (): Promise<CategoriaDTO[] | null> => {
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

  const getUserByEmail = async (): Promise<ClienteDTO | null> => {
    try {
      const { data } = await api.get<ClienteDTO>(
        `clientes/email?value=${email}`,
      );

      return data;
    } catch (err) {
      const error: ErrorTemplate = err as ErrorTemplate;

      Alert.alert(':(', `[${error.status}]: ${error.message}`);
      console.log('getUserByEmail: ', err);

      return null;
    }
  };

  return (
    <ServiceContext.Provider value={{ findAllCategories, getUserByEmail }}>
      {children}
    </ServiceContext.Provider>
  );
};

const UserService = () => {
  const context = useContext(ServiceContext);

  if (!context) {
    throw new Error('UserService: No UserService');
  }

  return context;
};

export { ServiceProvider, UserService };
