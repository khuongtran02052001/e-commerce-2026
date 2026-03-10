import type { IProduct } from '@/mock-data';
import { cached, fetchApi } from './_fetch';

export const getAllProducts = cached(
  async () => {
    const res = await fetchApi<IProduct[]>('/products', { service: 'system' });
    return res.data;
  },
  ['all-products'],
  { revalidate: 600 },
);

export const getDealProducts = cached(
  async () => {
    const res = await fetchApi<IProduct[]>('/products', {
      service: 'system',
      params: { variant: 'HOT' },
    });
    return res.data;
  },
  ['hot-products'],
  { revalidate: 300 },
);

export const getFeaturedProducts = cached(
  async () => {
    const res = await fetchApi<IProduct[]>('/products/featured', { service: 'system' });
    return res.data;
  },
  ['featured-products'],
  { revalidate: 600 },
);

export const getProductBySlug = cached(
  async (slug: string) => {
    const res = await fetchApi<IProduct>(`/products/${slug}`, { service: 'system' });
    return res.data;
  },
  ['product-by-slug'],
  { revalidate: 1800 },
);

export const getRelatedProducts = cached(
  async (categoryIds: string[], currentSlug: string, limit: number = 4) => {
    const res = await fetchApi<IProduct[]>('/products/related', {
      service: 'system',
      params: {
        categoryIds: JSON.stringify(categoryIds),
        currentSlug,
        limit,
      },
    });
    return res.data;
  },
  ['related-products'],
  { revalidate: 900 },
);

export const getProductsByCategory = cached(
  async (categorySlug: string) => {
    const res = await fetchApi<IProduct[]>('/products', {
      service: 'system',
      params: {
        category: categorySlug,
      },
    });
    return res.data;
  },
  ['products-by-category'],
  { revalidate: 600 },
);
