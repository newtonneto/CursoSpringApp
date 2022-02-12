import React, { createContext, useContext, useEffect, useRef } from 'react';
import axios, { AxiosResponse } from 'axios';

import { UseAuth } from './authProvider';
import { ErrorTemplate, ErrorField } from '../models/error';
import { ClienteDTO } from '../models/cliente.dto';
import { CategoriaDTO } from '../models/categoria.dto';
import { EstadoDTO } from '../models/estado.dto';
import { CidadeDTO } from '../models/cidade.dto';
import { ProdutoDTO } from '../models/produto.dto';
import { Page } from '../models/page';
import { ApiError } from '../exceptions/exceptions';

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
  getStates: Function;
  getCities: Function;
  createClient: Function;
  findProductsByCategory: Function;
  getProductById: Function;
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
    // baseURL: 'http://localhost:8080/',
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
      } else if (error.status === 422) {
        let message = 'Foram encontrados os seguintes errors de validação: \n';

        error.errors?.map((item: ErrorField): void => {
          message += `${item.message} \n`;
        });

        error.message = message;
      }

      return Promise.reject(new ApiError(error));
    },
  );

  const refreshToken = async (): Promise<void> => {
    try {
      const { headers } = await api.post('auth/refresh_token', {});

      handlerToken(headers.authorization);
    } catch (err) {
      console.log(err);
      logout();
    }
  };

  const findAllCategories = async (): Promise<CategoriaDTO[]> => {
    try {
      const { data } = await api.get<CategoriaDTO[]>('categorias');

      return data;
    } catch (err) {
      throw err;
    }
  };

  const getUserByEmail = async (): Promise<ClienteDTO> => {
    try {
      const { data } = await api.get<ClienteDTO>(
        `clientes/email?value=${email}`,
      );

      return data;
    } catch (err) {
      throw err;
    }
  };

  const getStates = async (): Promise<EstadoDTO[]> => {
    try {
      const { data } = await api.get<EstadoDTO[]>('estados');

      return data;
    } catch (err) {
      throw err;
    }
  };

  const getCities = async (id: string): Promise<CidadeDTO[]> => {
    try {
      const { data } = await api.get<CidadeDTO[]>(`estados/${id}/cidades`);

      return data;
    } catch (err) {
      throw err;
    }
  };

  const createClient = async (form: any): Promise<void> => {
    try {
      await api.post('clientes', form);
    } catch (err) {
      throw err;
    }
  };

  const findProductsByCategory = async (
    id: number,
  ): Promise<ProdutoDTO[] | null> => {
    try {
      const { data } = await api.get<Page>(`produtos/?categorias=${id}`);

      return data.content;
    } catch (err) {
      throw err;
    }
  };

  const getProductById = async (id: number): Promise<ProdutoDTO> => {
    try {
      const { data } = await api.get<ProdutoDTO>(`produtos/${id}`);

      return data;
    } catch (err) {
      throw err;
    }
  };

  return (
    <ServiceContext.Provider
      value={{
        findAllCategories,
        getUserByEmail,
        getStates,
        getCities,
        createClient,
        findProductsByCategory,
        getProductById,
      }}>
      {children}
    </ServiceContext.Provider>
  );
};

const UseService = () => {
  const context = useContext(ServiceContext);

  if (!context) {
    throw new Error('UserService: No UserService');
  }

  return context;
};

export { ServiceProvider, UseService };
