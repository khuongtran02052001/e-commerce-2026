import axiosClient from '@/lib/axiosClient';

export const getBrands = () => axiosClient.get('/brands');

export const getBrandNameByProductSlug = (slug: string) => {
  return axiosClient.get(`/brands/by-product/${slug}`);
};
