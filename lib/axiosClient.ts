import axios from 'axios';
import { getSession } from 'next-auth/react';

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080', // ví dụ: https://api.myapp.com
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* ---------------------- REQUEST INTERCEPTOR ---------------------- */
axiosClient.interceptors.request.use(
  async (config) => {
    // Lấy token từ localStorage (hoặc cookie tuỳ bạn)
    const session = await getSession();
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

/* ---------------------- RESPONSE INTERCEPTOR ---------------------- */
axiosClient.interceptors.response.use(
  (response) => response.data,

  async (error) => {
    const originalRequest = error.config;

    // Nếu 401 → thử refresh token (nếu cần)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken =
          typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Gửi request lấy token mới
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const newAccessToken = res.data?.access_token;

        if (newAccessToken) {
          // Lưu token mới
          localStorage.setItem('access_token', newAccessToken);

          // Gắn token vào header cũ
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return axiosClient(originalRequest);
        }
      } catch (err) {
        console.error('Refresh token failed:', err);
      }
    }

    // Log lỗi
    console.error('API Error:', error.response?.data || error.message);

    // Trả lỗi lại cho UI
    return Promise.reject(error.response?.data || error);
  },
);

export default axiosClient;
