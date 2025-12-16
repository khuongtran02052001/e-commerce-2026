import axiosClient from '@/lib/axiosClient';

export const getBanners = () => {
  return axiosClient.get('/banner');
};
