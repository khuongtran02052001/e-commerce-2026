import { axiosPublic } from '@/lib/axios/axiosPublic';
import axiosClient from '@/lib/axiosClient';
import { ICategory } from '@/mock-data';

export const getFeaturedCategories = () => {
  return axiosClient.get('/categories/featured');
};

export const getAllCategories = (quantity?: number) => {
  return axiosPublic.get<ICategory[]>('/categories', {
    params: { quantity },
  });
};

export const getAdminCategories = () => {
  return axiosClient.get('/admin/categories');
};
