import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { ErrorTemplate } from '../models/error';
interface ApiHandler {
  post<T, U>(url: string, payload: T): Promise<AxiosResponse<U>>;
}

const client = axios.create({
  baseURL: 'http://localhost:8080/',
  //baseURL: 'https://new2-curso-spring.herokuapp.com/',
});

const auth: ApiHandler = {
  post: async (url, payload) => {
    return client.post(url, payload);
  },
};

client.interceptors.request.use(
  function (config): AxiosRequestConfig<any> {
    return config;
  },
  function (error): Promise<any> {
    return Promise.reject(error);
  },
);

client.interceptors.response.use(
  function ({ headers }): string {
    return headers.authorization;
  },
  function ({ response }): Promise<ErrorTemplate> {
    let error: ErrorTemplate = response.data;

    return Promise.reject(error);
  },
);

export default auth;
