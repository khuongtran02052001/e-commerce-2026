import type { Order } from '@/types/domain/order';
import { fetchServiceJsonServer } from '@/lib/restClient';

export const getOrderById = async (orderId: string, accessToken?: string) => {
  return fetchServiceJsonServer<Order>(`/orders/${orderId}`, {
    service: 'system',
    accessToken,
  });
};

export const updateOrderById = async <TResponse = Order>(
  orderId: string,
  payload: Record<string, unknown>,
  accessToken?: string,
  method: 'PUT' | 'PATCH' = 'PUT',
) => {
  return fetchServiceJsonServer<TResponse>(`/orders/${orderId}`, {
    service: 'system',
    method,
    body: JSON.stringify(payload),
    accessToken,
  });
};
