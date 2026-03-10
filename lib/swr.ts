import { fetchServiceJson } from '@/lib/restClient';

export type SwrKey = [string, { params?: Record<string, string | number | boolean> }?];

const withParams = (url: string, params?: Record<string, string | number | boolean>) => {
  if (!params) return url;
  const query = new URLSearchParams(
    Object.entries(params).reduce<Record<string, string>>((acc, [key, value]) => {
      acc[key] = String(value);
      return acc;
    }, {}),
  ).toString();
  return query ? `${url}?${query}` : url;
};

export const productFetcher = <T>([url, config]: SwrKey) =>
  fetchServiceJson<T>(withParams(url, config?.params));

export const blogFetcher = <T>([url, config]: SwrKey) =>
  fetchServiceJson<T>(withParams(url, config?.params), { service: 'blog' });
