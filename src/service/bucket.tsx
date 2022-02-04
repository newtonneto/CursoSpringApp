import axios, { AxiosResponse } from 'axios';

interface ApiHandler {
  get<T>(url: string): Promise<AxiosResponse<T>>;
}

const client = axios.create({
  baseURL: 'https://new2-curso-spring.s3.sa-east-1.amazonaws.com/',
});

const bucket: ApiHandler = {
  get: async url => {
    return client.get(url);
  },
};

export default bucket;
