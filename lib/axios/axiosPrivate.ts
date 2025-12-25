import axios from 'axios';
import { axiosBase } from './axiosBase';

export const axiosPrivate = (accessToken?: string) => {
  if (!accessToken) {
    return axiosBase;
  }

  const instance = axios.create({
    baseURL: axiosBase.defaults.baseURL,
    timeout: axiosBase.defaults.timeout,
    headers: {
      ...axiosBase.defaults.headers.common,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  /* RESPONSE ERROR HANDLING (OPTIONAL) */
  instance.interceptors.response.use(
    (response) => response.data,
    (error) => {
      console.error('API Error:', error.response?.data || error.message);
      return Promise.reject(error.response?.data || error);
    },
  );

  return instance;
};
