import { axiosPublic } from '@/lib/axios/axiosPublic';
import axiosClient from '@/lib/axiosClient';
import { IBlogMock } from '@/mock-data';

export const getLatestBlogs = () => axiosPublic.get<IBlogMock[]>('/blogs/latest?limit=4');

export const getBlogs = (quantity?: number) => {
  return axiosClient.get('/blogs', { params: { quantity } });
};

export const getBlogBySlug = (slug: string) => {
  return axiosClient.get(`/blogs/${slug}`);
};

export const getOtherBlogs = (slug: string, quantity = 6) => {
  return axiosClient.get('/blogs/others', {
    params: { slug, quantity },
  });
};

export const getBlogCategories = () => {
  return axiosClient.get('/blogs/categories');
};
