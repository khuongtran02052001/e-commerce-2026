import type { AxiosRequestConfig } from 'axios';
import { axiosBase } from './axiosBase';

export const axiosPublic = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    axiosBase.get<T>(url, config).then((res) => res as unknown as T),
  post: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    axiosBase.post<T>(url, body, config).then((res) => res as unknown as T),
  put: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    axiosBase.put<T>(url, body, config).then((res) => res as unknown as T),
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    axiosBase.delete<T>(url, config).then((res) => res as unknown as T),
};
