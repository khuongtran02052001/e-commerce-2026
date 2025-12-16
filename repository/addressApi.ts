import axiosClient from '@/lib/axiosClient';

export const getAddresses = () => axiosClient.get('/address');
