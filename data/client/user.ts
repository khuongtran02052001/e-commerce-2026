import { fetchServiceJson } from '@/lib/restClient';
import type {
  Address,
  CartItem,
  Notification,
  Order,
  PaginatedResult,
  User,
} from '@/types/common-type';

export const getUserFullProfile = (userId: string) => {
  return fetchServiceJson<User>(`/users/${userId}/full`);
};

export const getUserProfile = (userId: string) => {
  return fetchServiceJson<User>(`/users/${userId}`);
};

export const updateUserProfile = (userId: string, payload: unknown) => {
  return fetchServiceJson<User>(`/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
};

export const getUserAddresses = (userId: string) => {
  return fetchServiceJson<PaginatedResult<Address>>(`/users/${userId}/addresses`);
};

export const addUserAddress = (userId: string, payload: unknown) => {
  return fetchServiceJson<Address>(`/users/${userId}/addresses`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const updateUserAddress = (userId: string, addressId: string, payload: unknown) => {
  return fetchServiceJson<Address>(`/users/${userId}/addresses/${addressId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
};

export const deleteUserAddress = (userId: string, addressId: string) => {
  return fetchServiceJson<void>(`/users/${userId}/addresses/${addressId}`, {
    method: 'DELETE',
  });
};

export const getUserCart = (userId: string) => {
  return fetchServiceJson<PaginatedResult<CartItem>>(`/users/${userId}/cart`);
};

export const addToCart = (userId: string, payload: unknown) => {
  return fetchServiceJson<CartItem>(`/users/${userId}/cart`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const updateCartItem = (userId: string, productId: string, payload: unknown) => {
  return fetchServiceJson<CartItem>(`/users/${userId}/cart/${productId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
};

export const removeCartItem = (userId: string, productId: string) => {
  return fetchServiceJson<void>(`/users/${userId}/cart/${productId}`, {
    method: 'DELETE',
  });
};

export const clearCart = (userId: string) => {
  return fetchServiceJson<void>(`/users/${userId}/cart`, {
    method: 'DELETE',
  });
};

export const getUserWishlist = (userId: string) => {
  return fetchServiceJson<PaginatedResult<unknown>>(`/users/${userId}/wishlist`);
};

export const addWishlistItem = (userId: string, productId: string) => {
  return fetchServiceJson<unknown>(`/users/${userId}/wishlist`, {
    method: 'POST',
    body: JSON.stringify({ productId }),
  });
};

export const removeWishlistItem = (userId: string, productId: string) => {
  return fetchServiceJson<void>(`/users/${userId}/wishlist/${productId}`, {
    method: 'DELETE',
  });
};

export const getUserOrders = (userId: string) => {
  return fetchServiceJson<PaginatedResult<Order>>(`/users/${userId}/orders`);
};

export const createOrder = (userId: string, payload: unknown) => {
  return fetchServiceJson<Order>(`/users/${userId}/orders`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const getOrderById = (orderId: string) => {
  return fetchServiceJson<Order>(`/orders/${orderId}`);
};

export const updateOrderStatus = (orderId: string, payload: unknown) => {
  return fetchServiceJson<Order>(`/orders/${orderId}/status`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
};

export const getUserNotifications = (userId: string) => {
  return fetchServiceJson<PaginatedResult<Notification>>(`/users/${userId}/notifications`);
};

export const markNotificationAsRead = (userId: string, notificationId: string) => {
  return fetchServiceJson<Notification>(`/users/${userId}/notifications/${notificationId}/read`, {
    method: 'PUT',
  });
};

export const deleteUserNotification = (userId: string, notificationId: string) => {
  return fetchServiceJson<void>(`/users/${userId}/notifications/${notificationId}`, {
    method: 'DELETE',
  });
};

export const getUserPoints = (userId: string) => {
  return fetchServiceJson<unknown>(`/users/${userId}/points`);
};

export const updateUserPoints = (userId: string, payload: unknown) => {
  return fetchServiceJson<unknown>(`/users/${userId}/points`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
};

export const getUserStats = (userId: string) => {
  return fetchServiceJson<unknown>(`/users/${userId}/stats`);
};
