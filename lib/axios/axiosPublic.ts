import { axiosBase } from './axiosBase';

export const axiosPublic = {
  get: <T>(url: string, params?: any) => axiosBase.get<T>(url, { params }).then((res) => res.data),

  post: <T>(url: string, body?: any) => axiosBase.post<T>(url, body).then((res) => res.data),

  put: <T>(url: string, body?: any) => axiosBase.put<T>(url, body).then((res) => res.data),

  delete: <T>(url: string) => axiosBase.delete<T>(url).then((res) => res.data),
};
