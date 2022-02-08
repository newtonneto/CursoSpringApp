import axios, { AxiosResponse } from 'axios';

interface ApiHandler {
  get<T>(url: string): Promise<AxiosResponse<T>>;
}

const client = axios.create({
  baseURL: 'https://viacep.com.br/ws/',
});

const cep: ApiHandler = {
  get: async url => {
    return client.get(url);
  },
};

export default cep;
