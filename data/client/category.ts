import { fetchServiceJson } from '@/lib/restClient';
import type { ICategory } from '@/mock-data';
import type { PaginatedResult } from '@/types/common-type';

export const getFeaturedCategories = () => {
  return fetchServiceJson<PaginatedResult<ICategory>>('/categories/featured');
};

export const getAllCategories = (quantity?: number) => {
  const query = new URLSearchParams(
    quantity ? { quantity: String(quantity) } : {},
  ).toString();
  return fetchServiceJson<PaginatedResult<ICategory>>(
    query ? `/categories?${query}` : '/categories',
  );
};

export const getAdminCategories = () => {
  return fetchServiceJson<PaginatedResult<ICategory>>('/admin/categories');
};
