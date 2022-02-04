import axios, { AxiosResponse } from 'axios';

interface ApiHandler {
  post<T, U>(url: string, payload: T): Promise<AxiosResponse<U>>;
}

interface Error {
  error: string;
  message: string;
  path: string;
  status: string;
  timestamp: string;
}

const client = axios.create({
  baseURL: 'https://new2-curso-spring.herokuapp.com/',
});

const auth: ApiHandler = {
  post: async (url, payload) => {
    return client.post(url, payload);
  },
};

client.interceptors.request.use(
  function (config) {
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
  function ({ response }) {
    let error: Error = response.data;

    return Promise.reject(error);
  },
);

export default auth;
