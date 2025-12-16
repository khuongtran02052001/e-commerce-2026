import axiosClient from '@/lib/axiosClient';

/* ============================================================
   USER PROFILE + METADATA
============================================================ */

// Full profile (giống USER_BY_CLERK_ID_QUERY)
export const getUserFullProfile = (userId: string) => {
  return axiosClient.get(`/users/${userId}/full`);
};

// Basic profile
export const getUserProfile = (userId: string) => {
  return axiosClient.get(`/users/${userId}`);
};

// Update profile
export const updateUserProfile = (userId: string, payload: any) => {
  return axiosClient.put(`/users/${userId}`, payload);
};

/* ============================================================
   ADDRESSES
============================================================ */

export const getUserAddresses = (userId: string) => {
  return axiosClient.get(`/users/${userId}/addresses`);
};

export const addUserAddress = (userId: string, payload: any) => {
  return axiosClient.post(`/users/${userId}/addresses`, payload);
};

export const updateUserAddress = (userId: string, addressId: string, payload: any) => {
  return axiosClient.put(`/users/${userId}/addresses/${addressId}`, payload);
};

export const deleteUserAddress = (userId: string, addressId: string) => {
  return axiosClient.delete(`/users/${userId}/addresses/${addressId}`);
};

/* ============================================================
   CART
============================================================ */

export const getUserCart = (userId: string) => {
  return axiosClient.get(`/users/${userId}/cart`);
};

export const addToCart = (userId: string, payload: any) => {
  return axiosClient.post(`/users/${userId}/cart`, payload);
};

export const updateCartItem = (userId: string, productId: string, payload: any) => {
  return axiosClient.put(`/users/${userId}/cart/${productId}`, payload);
};

export const removeCartItem = (userId: string, productId: string) => {
  return axiosClient.delete(`/users/${userId}/cart/${productId}`);
};

export const clearCart = (userId: string) => {
  return axiosClient.delete(`/users/${userId}/cart`);
};

/* ============================================================
   WISHLIST
============================================================ */

export const getUserWishlist = (userId: string) => {
  return axiosClient.get(`/users/${userId}/wishlist`);
};

export const addWishlistItem = (userId: string, productId: string) => {
  return axiosClient.post(`/users/${userId}/wishlist`, { productId });
};

export const removeWishlistItem = (userId: string, productId: string) => {
  return axiosClient.delete(`/users/${userId}/wishlist/${productId}`);
};

/* ============================================================
   ORDERS
============================================================ */

export const getUserOrders = (userId: string) => {
  return axiosClient.get(`/users/${userId}/orders`);
};

export const createOrder = (userId: string, payload: any) => {
  return axiosClient.post(`/users/${userId}/orders`, payload);
};

export const getOrderById = (orderId: string) => {
  return axiosClient.get(`/orders/${orderId}`);
};

// Update order status (admin or logistics)
export const updateOrderStatus = (orderId: string, payload: any) => {
  return axiosClient.put(`/orders/${orderId}/status`, payload);
};

/* ============================================================
   NOTIFICATIONS
============================================================ */

export const getUserNotifications = (userId: string) => {
  return axiosClient.get(`/users/${userId}/notifications`);
};

export const markNotificationAsRead = (userId: string, notificationId: string) => {
  return axiosClient.put(`/users/${userId}/notifications/${notificationId}/read`);
};

export const deleteUserNotification = (userId: string, notificationId: string) => {
  return axiosClient.delete(`/users/${userId}/notifications/${notificationId}`);
};

/* ============================================================
   POINTS + REWARDS
============================================================ */

export const getUserPoints = (userId: string) => {
  return axiosClient.get(`/users/${userId}/points`);
};

export const updateUserPoints = (userId: string, payload: any) => {
  return axiosClient.put(`/users/${userId}/points`, payload);
};

/* ============================================================
   USER STATS (total spent, last login, etc.)
============================================================ */

export const getUserStats = (userId: string) => {
  return axiosClient.get(`/users/${userId}/stats`);
};
