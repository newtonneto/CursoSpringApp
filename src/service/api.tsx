import axios, { AxiosResponse } from 'axios';

import { ErrorTemplate } from '../models/error';
interface ApiHandler {
  get<T>(url: string): Promise<AxiosResponse<T>>;
  post<T, U>(url: string, payload: T): Promise<AxiosResponse<U>>;
}

const client = axios.create({
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

client.interceptors.response.use(
  function (response) {
    return response;
  },
  function ({ response }) {
    let error: ErrorTemplate = response.data;

    return Promise.reject(error);
  },
);

export default api;
