'use server';

import { auth } from '@/lib/auth';
import { fetchServiceJson, fetchServiceJsonServer } from '@/lib/restClient';

type RequestConfig = {
  params?: Record<string, string | number | boolean>;
  data?: unknown;
  headers?: HeadersInit;
  accessToken?: string;
};

const buildUrl = (url: string, params?: Record<string, string | number | boolean>) => {
  if (!params) return url;
  const query = new URLSearchParams(
    Object.entries(params).reduce<Record<string, string>>((acc, [key, value]) => {
      acc[key] = String(value);
      return acc;
    }, {}),
  ).toString();
  return query ? `${url}?${query}` : url;
};

const request = async <T>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  url: string,
  data?: unknown,
  config?: RequestConfig,
): Promise<T> => {
  const resolvedUrl = buildUrl(url, config?.params);
  const body = data ?? config?.data;

  if (typeof window === 'undefined') {
    const session = await auth();
    const accessToken = config?.accessToken ?? session?.accessToken;
    return fetchServiceJsonServer<T>(resolvedUrl, {
      method,
      body: body ? JSON.stringify(body) : undefined,
      headers: config?.headers,
      accessToken,
    });
  }

  return fetchServiceJson<T>(resolvedUrl, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: config?.headers,
  });
};

const axiosClient = {
  get: <T>(url: string, config?: RequestConfig) => request<T>('GET', url, undefined, config),
  post: <T>(url: string, data?: unknown, config?: RequestConfig) =>
    request<T>('POST', url, data, config),
  put: <T>(url: string, data?: unknown, config?: RequestConfig) =>
    request<T>('PUT', url, data, config),
  patch: <T>(url: string, data?: unknown, config?: RequestConfig) =>
    request<T>('PATCH', url, data, config),
  delete: <T>(url: string, config?: RequestConfig) => request<T>('DELETE', url, undefined, config),
};

const legacySanityClient: any = new Proxy(
  {},
  {
    get: () => () => {
      throw new Error('Sanity client removed. Replace with REST.');
    },
  },
);

export const client = legacySanityClient;
export const writeClient = legacySanityClient;

export default axiosClient;
