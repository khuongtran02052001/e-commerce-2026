import { cached, fetchApi } from './_fetch';

export const getBanner = cached(
  async () => {
    const res = await fetchApi('/banners', { service: 'root' });
    return res.data;
  },
  ['banner'],
  { revalidate: 300 },
);
