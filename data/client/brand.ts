import { fetchServiceJson } from '@/lib/restClient';
import type { IBrand } from '@/mock-data';
import type { PaginatedResult } from '@/types/common-type';

export const getBrands = () => fetchServiceJson<PaginatedResult<IBrand>>('/brands');

export const getBrandNameByProductSlug = (slug: string) => {
  return fetchServiceJson<IBrand>(`/brands/by-product/${slug}`);
};
