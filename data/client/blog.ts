import { fetchServiceJson } from '@/lib/restClient';
import type { BlogCategory, IBlogMock } from '@/mock-data';
import type { PaginatedResult } from '@/types/common-type';

export const getLatestBlogs = () =>
  fetchServiceJson<PaginatedResult<IBlogMock>>('/latest?limit=4', { service: 'blog' });

export const getBlogs = (quantity?: number) => {
  const query = new URLSearchParams(
    quantity ? { quantity: String(quantity) } : {},
  ).toString();
  return fetchServiceJson<PaginatedResult<IBlogMock>>(
    query ? `/blogs?${query}` : '/blogs',
    { service: 'blog' },
  );
};

export const getBlogBySlug = (slug: string) => {
  return fetchServiceJson<IBlogMock>(`/blogs/${slug}`, { service: 'blog' });
};

export const getOtherBlogs = (slug: string, quantity = 6) => {
  const query = new URLSearchParams({ slug, quantity: String(quantity) }).toString();
  return fetchServiceJson<PaginatedResult<IBlogMock>>(`/blogs/others?${query}`, {
    service: 'blog',
  });
};

export const getBlogCategories = () => {
  return fetchServiceJson<PaginatedResult<BlogCategory>>('/blogs/categories', {
    service: 'blog',
  });
};
