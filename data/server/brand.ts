import type { IBrand } from '@/mock-data';
import { cached, fetchApi } from './_fetch';

export const getAllBrands = cached(
  async () => {
    const res = await fetchApi<IBrand[]>('/brands', { service: 'system' });
    return res.data;
  },
  ['all-brands'],
  { revalidate: 3600 },
);

export const getBrand = cached(
  async (slug: string) => {
    const res = await fetchApi<IBrand>(`/brands/slug/${slug}`, { service: 'system' });
    return res;
  },
  ['brand-by-slug'],
  { revalidate: 1800 },
);
