import { fetchApi } from './_fetch';

export const getAddresses = async (userId: string) => {
  const res = await fetchApi(`/users/${userId}/addresses`, { service: 'system' });
  return res.data;
};
