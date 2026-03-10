import { unstable_cache } from 'next/cache';

type ApiResult<T> = { data: T | null };

type ServiceKey = 'root' | 'system' | 'blog';

const SERVICE_BASES: Record<ServiceKey, string> = {
  root: '',
  system: '/service-system/v1/api',
  blog: '/service-blog/v1/api',
};

const buildQuery = (params?: Record<string, unknown>) => {
  if (!params) return '';
  const entries = Object.entries(params).reduce<Record<string, string>>((acc, [key, value]) => {
    if (value === undefined || value === null) return acc;
    if (Array.isArray(value)) {
      acc[key] = value.join(',');
    } else {
      acc[key] = String(value);
    }
    return acc;
  }, {});
  const query = new URLSearchParams(entries).toString();
  return query ? `?${query}` : '';
};

const buildUrl = (path: string, service: ServiceKey) => {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const base = SERVICE_BASES[service] || '';
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${process.env.NEXT_PUBLIC_API_URL}${base}${normalizedPath}`;
};

/**
 * Always return an object with a `data` field so callers can safely access `.data`.
 * If the upstream already returns `{ data: ... }` we forward it, otherwise we wrap the JSON.
 */
export async function fetchApi<T>(
  path: string,
  options?: { service?: ServiceKey; params?: Record<string, unknown> },
): Promise<ApiResult<T>> {
  try {
    const { service = 'root', params } = options || {};
    const query = buildQuery(params);
    const url = `${buildUrl(path, service)}${query}`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    const json = await res.json();

    if (json && typeof json === 'object' && 'data' in json) {
      return { data: (json as { data: T }).data };
    }

    return { data: (json as T) ?? null };
  } catch {
    return { data: null };
  }
}

export const cached = unstable_cache;
