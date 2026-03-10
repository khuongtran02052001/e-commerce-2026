import { getSession } from 'next-auth/react';

const SERVICE_SYSTEM_BASE = `${process.env.NEXT_PUBLIC_API_URL}/service-system/v1/api`;
const SERVICE_BLOG_BASE = `${process.env.NEXT_PUBLIC_API_URL}/service-blog/v1/api`;

const buildBaseUrl = (service: 'system' | 'blog') =>
  service === 'blog' ? SERVICE_BLOG_BASE : SERVICE_SYSTEM_BASE;

export const buildServiceUrl = (path: string, service: 'system' | 'blog' = 'system') => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${buildBaseUrl(service)}${normalizedPath}`;
};

const sessionCache: {
  value: Awaited<ReturnType<typeof getSession>> | null;
  expiresAt: number;
  inFlight: Promise<Awaited<ReturnType<typeof getSession>> | null> | null;
} = {
  value: null,
  expiresAt: 0,
  inFlight: null,
};

const getCachedSession = async () => {
  const now = Date.now();
  if (sessionCache.value && now < sessionCache.expiresAt) {
    return sessionCache.value;
  }

  if (sessionCache.inFlight) {
    return sessionCache.inFlight;
  }

  sessionCache.inFlight = getSession()
    .then((session) => {
      sessionCache.value = session;
      sessionCache.expiresAt = Date.now() + 10_000;
      sessionCache.inFlight = null;
      return session;
    })
    .catch((error) => {
      sessionCache.inFlight = null;
      throw error;
    });

  return sessionCache.inFlight;
};

export const fetchService = async (
  path: string,
  options?: RequestInit & { service?: 'system' | 'blog'; accessToken?: string },
) => {
  const { service = 'system', headers, accessToken, ...rest } = options || {};
  const mergedHeaders = new Headers(headers);

  if (!mergedHeaders.has('Authorization')) {
    const token =
      accessToken ||
      (await getCachedSession()
        .then((session) => session?.accessToken)
        .catch(() => undefined));
    if (token) {
      mergedHeaders.set('Authorization', `Bearer ${token}`);
    }
  }

  if (!mergedHeaders.has('Content-Type') && rest.body) {
    mergedHeaders.set('Content-Type', 'application/json');
  }
  console.log('path', path);
  return fetch(buildServiceUrl(path, service), {
    ...rest,
    headers: mergedHeaders,
  });
};

export const fetchServiceJson = async <T>(
  path: string,
  options?: RequestInit & { service?: 'system' | 'blog'; accessToken?: string },
): Promise<T> => {
  const res = await fetchService(path, options);
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  const json = await res.json();
  if (json && typeof json === 'object' && 'data' in json) {
    return (json as { data: T }).data;
  }
  return json as T;
};

export const fetchServiceServer = async (
  path: string,
  options?: RequestInit & { service?: 'system' | 'blog'; accessToken?: string },
) => {
  const { service = 'system', headers, accessToken, ...rest } = options || {};
  const mergedHeaders = new Headers(headers);

  if (accessToken) {
    mergedHeaders.set('Authorization', `Bearer ${accessToken}`);
  }

  if (!mergedHeaders.has('Content-Type') && rest.body) {
    mergedHeaders.set('Content-Type', 'application/json');
  }

  return fetch(buildServiceUrl(path, service), {
    ...rest,
    headers: mergedHeaders,
  });
};

export const fetchServiceJsonServer = async <T>(
  path: string,
  options?: RequestInit & { service?: 'system' | 'blog'; accessToken?: string },
): Promise<T> => {
  const res = await fetchServiceServer(path, options);
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  const json = await res.json();
  if (json && typeof json === 'object' && 'data' in json) {
    return (json as { data: T }).data;
  }
  return json as T;
};
