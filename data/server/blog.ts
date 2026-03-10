import type { BlogCategory, IBlogMock } from '@/mock-data';
import { cached, fetchApi } from './_fetch';

export const getLatestBlogs = cached(
  async () => {
    const res = await fetchApi<IBlogMock[]>('/latest', { service: 'blog', params: { limit: 4 } });
    return res.data;
  },
  ['latest-blogs'],
  { revalidate: 300 },
);

export const getAllBlogs = cached(
  async (quantity: number) => {
    const res = await fetchApi<IBlogMock[]>('/', { service: 'blog', params: { quantity } });
    return res.data;
  },
  ['all-blogs'],
  { revalidate: 600 },
);

export const getSingleBlog = cached(
  async (slug: string) => {
    const res = await fetchApi<IBlogMock>(`/slug/${slug}`, { service: 'blog' });
    return res.data;
  },
  ['single-blog'],
  { revalidate: 1800 },
);

export const getBlogCategories = cached(
  async () => {
    const res = await fetchApi<BlogCategory[]>('/categories', { service: 'blog' });
    return res.data;
  },
  ['blog-categories'],
  { revalidate: 3600 },
);

export const getOthersBlog = cached(
  async (slug: string, quantity: number) => {
    const res = await fetchApi<IBlogMock[]>('/others', {
      service: 'blog',
      params: { slug, quantity },
    });
    return res.data;
  },
  ['others-blog'],
  { revalidate: 600 },
);
