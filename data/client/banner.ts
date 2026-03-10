import { fetchServiceJson } from '@/lib/restClient';

export const getBanners = () => fetchServiceJson('/banner');
