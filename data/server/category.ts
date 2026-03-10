import type { ICategory } from '@/mock-data';
import { cached, fetchApi } from './_fetch';

export const getFeaturedCategory = cached(
  async (quantity: number) => {
    const res = await fetchApi<ICategory[]>('/categories', {
      service: 'system',
      params: { perPage: Math.max(1, quantity) },
    });
    const categories = res.data || [];
    return categories.filter((category) => category.featured).slice(0, quantity);
  },
  ['featured-categories'],
  { revalidate: 900 },
);

export const getCategories = cached(
  async (quantity?: number) => {
    const res = await fetchApi<ICategory[]>('/categories', {
      service: 'system',
      params: { quantity },
    });
    return res.data;
  },
  ['categories-list'],
  { revalidate: 900 },
);

export const getAdminCategories = async () => {
  const res = await fetchApi('/admin/categories', { service: 'system' });
  return res.data;
};
