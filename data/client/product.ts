import { fetchServiceJson } from '@/lib/restClient';
import type { IProduct } from '@/mock-data';
import type { PaginatedResult } from '@/types/common-type';

export const getDealProducts = () => {
  const query = new URLSearchParams({ variant: 'HOT' }).toString();
  return fetchServiceJson<PaginatedResult<IProduct>>(`/products?${query}`);
};

export const getFeaturedProducts = () => {
  return fetchServiceJson<PaginatedResult<IProduct>>('/products/featured');
};

export const getProductBySlug = (slug: string) => {
  return fetchServiceJson<IProduct>(`/products/${slug}`);
};

export const getRelatedProducts = (categoryIds: string, currentSlug: string, limit = 6) => {
  const query = new URLSearchParams({
    categoryIds,
    currentSlug,
    limit: String(limit),
  }).toString();
  return fetchServiceJson<PaginatedResult<IProduct>>(`/products/related?${query}`);
};

export const getSearchProducts = (search: string) => {
  const query = new URLSearchParams({ search }).toString();
  return fetchServiceJson<PaginatedResult<IProduct>>(`/products/search?${query}`);
};
