import axiosClient from '@/lib/axiosClient';

export const getFeaturedCategories = () => {
  return axiosClient.get('/categories/featured');
};

export const getAllCategories = (quantity?: number) => {
  return axiosClient.get('/categories', {
    params: { quantity },
  });
};

export const getAdminCategories = () => {
  return axiosClient.get('/admin/categories');
};
