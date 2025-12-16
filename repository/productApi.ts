import axiosClient from '@/lib/axiosClient';

export const getDealProducts = () => {
  return axiosClient.get('/products/deals');
};
export const getFeaturedProducts = () => {
  return axiosClient.get('/products/featured');
};

export const getProductBySlug = (slug: string) => {
  return axiosClient.get(`/products/${slug}`);
};

export const getRelatedProducts = (categoryIds: string, currentSlug: string, limit = 6) => {
  return axiosClient.get('/products/related', {
    params: {
      categoryIds,
      currentSlug,
      limit,
    },
  });
};
