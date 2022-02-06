import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { ErrorTemplate } from '../models/error';
interface ApiHandler {
  get<T>(url: string): Promise<AxiosResponse<T>>;
  authorized_get<T>(
    url: string,
    config: AxiosRequestConfig<any>,
  ): Promise<AxiosResponse<T>>;
  post<T, U>(url: string, payload: T): Promise<AxiosResponse<U>>;
}

const client = axios.create({
  baseURL: 'https://new2-curso-spring.herokuapp.com/',
});

const api: ApiHandler = {
  get: async url => {
    return client.get(url);
  },
  authorized_get: async (url, config) => {
    return client.get(url, config);
  },
  post: async (url, payload) => {
    return client.post(url, payload);
  },
};

client.interceptors.response.use(
  function (response) {
    return response;
  },
  function ({ response }): Promise<ErrorTemplate> {
    let error: ErrorTemplate = response.data;

    return Promise.reject(error);
  },
);

export default api;
