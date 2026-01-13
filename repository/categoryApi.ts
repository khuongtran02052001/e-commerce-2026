import { axiosPublic } from '@/lib/axios/axiosPublic';
import axiosClient from '@/lib/axiosClient';
import type { ICategory } from '@/mock-data';
import type { PaginatedResult } from '@/types/common-type';

export const getFeaturedCategories = () => {
  return axiosClient.get<PaginatedResult<ICategory>>('/categories/featured');
};

export const getAllCategories = (quantity?: number) => {
  return axiosPublic.get<PaginatedResult<ICategory>>('/categories', {
    params: { quantity },
  });
};

export const getAdminCategories = () => {
  return axiosClient.get<PaginatedResult<ICategory>>('/admin/categories');
};
