import axiosClient from '@/lib/axiosClient';
import type { IProduct } from '@/mock-data';
import type { PaginatedResult } from '@/types/common-type';

export const getDealProducts = () => {
  return axiosClient.get<PaginatedResult<IProduct>>('/products/deals');
};
export const getFeaturedProducts = () => {
  return axiosClient.get<PaginatedResult<IProduct>>('/products/featured');
};

export const getProductBySlug = (slug: string) => {
  return axiosClient.get<IProduct>(`/products/${slug}`);
};

export const getRelatedProducts = (categoryIds: string, currentSlug: string, limit = 6) => {
  return axiosClient.get<PaginatedResult<IProduct>>('/products/related', {
    params: {
      categoryIds,
      currentSlug,
      limit,
    },
  });
};
