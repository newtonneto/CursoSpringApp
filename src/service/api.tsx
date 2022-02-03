import axios, { AxiosResponse } from 'axios';

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

export default api;
