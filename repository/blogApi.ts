import { axiosPublic } from '@/lib/axios/axiosPublic';
import axiosClient from '@/lib/axiosClient';
import type { IBlogCategoryMock, IBlogMock } from '@/mock-data';
import type { PaginatedResult } from '@/types/common-type';

export const getLatestBlogs = () =>
  axiosPublic.get<PaginatedResult<IBlogMock>>('/blogs/latest?limit=4');

export const getBlogs = (quantity?: number) => {
  return axiosClient.get<PaginatedResult<IBlogMock>>('/blogs', { params: { quantity } });
};

export const getBlogBySlug = (slug: string) => {
  return axiosClient.get<IBlogMock>(`/blogs/${slug}`);
};

export const getOtherBlogs = (slug: string, quantity = 6) => {
  return axiosClient.get<PaginatedResult<IBlogMock>>('/blogs/others', {
    params: { slug, quantity },
  });
};

export const getBlogCategories = () => {
  return axiosClient.get<PaginatedResult<IBlogCategoryMock>>('/blogs/categories');
};
