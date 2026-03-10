import type { Order } from '@/types/domain/order';
import { fetchService } from '@/lib/restClient';

export interface AdminOrdersMeta {
  page: number;
  perPage: number;
  totalCount: number;
  hasNextPage: boolean;
}

export interface AdminOrdersResponse {
  data: Order[];
  meta?: Partial<AdminOrdersMeta>;
  totalCount?: number;
  hasNextPage?: boolean;
}

export type AdminOrderResponse = { data?: Order; order?: Order } | Order;

const requestAdmin = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const response = await fetchService(path, {
    ...options,
    cache: 'no-store',
    headers: options?.headers,
  });

  if (!response.ok) {
    let details = '';
    try {
      const body = await response.text();
      details = body ? ` - ${body}` : '';
    } catch {
      // ignore response parse failure for error payload
    }
    throw new Error(`Request failed: ${response.status} ${response.statusText}${details}`);
  }

  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    throw new Error(`Expected JSON but got ${contentType}: ${text.slice(0, 120)}...`);
  }

  return (await response.json()) as T;
};

export const getAdminOrders = async ({
  page,
  perPage,
  status,
  cacheBust = false,
}: {
  page: number;
  perPage: number;
  status?: string;
  cacheBust?: boolean;
}) => {
  const params = new URLSearchParams({
    page: String(page),
    perPage: String(perPage),
  });

  if (status) {
    params.set('status', status);
  }
  if (cacheBust) {
    params.set('_t', String(Date.now()));
  }

  return requestAdmin<AdminOrdersResponse>(`/admin/orders?${params.toString()}`);
};

export const getAdminOrderById = async (orderId: string, cacheBust = false) => {
  const suffix = cacheBust ? `?_t=${Date.now()}` : '';
  return requestAdmin<AdminOrderResponse>(`/admin/orders/${orderId}${suffix}`);
};

export const updateAdminOrder = async (orderId: string, payload: Record<string, unknown>) => {
  return requestAdmin<Record<string, unknown>>(`/admin/orders/${orderId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
};

export const deleteAdminOrders = async (orderIds: string[]) => {
  return requestAdmin<Record<string, unknown>>('/admin/orders', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderIds }),
  });
};
