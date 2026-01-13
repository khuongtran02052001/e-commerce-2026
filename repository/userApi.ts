import axiosClient from '@/lib/axiosClient';
import type {
  Address,
  CartItem,
  Notification,
  Order,
  PaginatedResult,
  User,
} from '@/types/common-type';

/* ============================================================
   USER PROFILE + METADATA
============================================================ */

// Full profile (giống USER_BY_CLERK_ID_QUERY)
export const getUserFullProfile = (userId: string) => {
  return axiosClient.get<User>(`/users/${userId}/full`);
};

// Basic profile
export const getUserProfile = (userId: string) => {
  return axiosClient.get<User>(`/users/${userId}`);
};

// Update profile
export const updateUserProfile = (userId: string, payload: any) => {
  return axiosClient.put<User>(`/users/${userId}`, payload);
};

/* ============================================================
   ADDRESSES
============================================================ */

export const getUserAddresses = (userId: string) => {
  return axiosClient.get<PaginatedResult<Address>>(`/users/${userId}/addresses`);
};

export const addUserAddress = (userId: string, payload: any) => {
  return axiosClient.post<Address>(`/users/${userId}/addresses`, payload);
};

export const updateUserAddress = (userId: string, addressId: string, payload: any) => {
  return axiosClient.put<Address>(`/users/${userId}/addresses/${addressId}`, payload);
};

export const deleteUserAddress = (userId: string, addressId: string) => {
  return axiosClient.delete<void>(`/users/${userId}/addresses/${addressId}`);
};

/* ============================================================
   CART
============================================================ */

export const getUserCart = (userId: string) => {
  return axiosClient.get<PaginatedResult<CartItem>>(`/users/${userId}/cart`);
};

export const addToCart = (userId: string, payload: any) => {
  return axiosClient.post<CartItem>(`/users/${userId}/cart`, payload);
};

export const updateCartItem = (userId: string, productId: string, payload: any) => {
  return axiosClient.put<CartItem>(`/users/${userId}/cart/${productId}`, payload);
};

export const removeCartItem = (userId: string, productId: string) => {
  return axiosClient.delete<void>(`/users/${userId}/cart/${productId}`);
};

export const clearCart = (userId: string) => {
  return axiosClient.delete<void>(`/users/${userId}/cart`);
};

/* ============================================================
   WISHLIST
============================================================ */

export const getUserWishlist = (userId: string) => {
  return axiosClient.get<PaginatedResult<unknown>>(`/users/${userId}/wishlist`);
};

export const addWishlistItem = (userId: string, productId: string) => {
  return axiosClient.post<unknown>(`/users/${userId}/wishlist`, { productId });
};

export const removeWishlistItem = (userId: string, productId: string) => {
  return axiosClient.delete<void>(`/users/${userId}/wishlist/${productId}`);
};

/* ============================================================
   ORDERS
============================================================ */

export const getUserOrders = (userId: string) => {
  return axiosClient.get<PaginatedResult<Order>>(`/users/${userId}/orders`);
};

export const createOrder = (userId: string, payload: any) => {
  return axiosClient.post<Order>(`/users/${userId}/orders`, payload);
};

export const getOrderById = (orderId: string) => {
  return axiosClient.get<Order>(`/orders/${orderId}`);
};

// Update order status (admin or logistics)
export const updateOrderStatus = (orderId: string, payload: any) => {
  return axiosClient.put<Order>(`/orders/${orderId}/status`, payload);
};

/* ============================================================
   NOTIFICATIONS
============================================================ */

export const getUserNotifications = (userId: string) => {
  return axiosClient.get<PaginatedResult<Notification>>(`/users/${userId}/notifications`);
};

export const markNotificationAsRead = (userId: string, notificationId: string) => {
  return axiosClient.put<Notification>(
    `/users/${userId}/notifications/${notificationId}/read`,
  );
};

export const deleteUserNotification = (userId: string, notificationId: string) => {
  return axiosClient.delete<void>(`/users/${userId}/notifications/${notificationId}`);
};

/* ============================================================
   POINTS + REWARDS
============================================================ */

export const getUserPoints = (userId: string) => {
  return axiosClient.get<unknown>(`/users/${userId}/points`);
};

export const updateUserPoints = (userId: string, payload: any) => {
  return axiosClient.put<unknown>(`/users/${userId}/points`, payload);
};

/* ============================================================
   USER STATS (total spent, last login, etc.)
============================================================ */

export const getUserStats = (userId: string) => {
  return axiosClient.get<unknown>(`/users/${userId}/stats`);
};
