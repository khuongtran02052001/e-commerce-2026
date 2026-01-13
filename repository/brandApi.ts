import axiosClient from '@/lib/axiosClient';
import type { IBrand } from '@/mock-data';
import type { PaginatedResult } from '@/types/common-type';

export const getBrands = () => axiosClient.get<PaginatedResult<IBrand>>('/brands');

export const getBrandNameByProductSlug = (slug: string) => {
  return axiosClient.get<IBrand>(`/brands/by-product/${slug}`);
};
