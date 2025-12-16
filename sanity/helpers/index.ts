import axiosClient from '@/lib/axiosClient';

/* ============================================================
   1. Get products by category slug
============================================================ */

export const getProductsByCategory = async (categorySlug: string) => {
  try {
    const data = await axiosClient.get('/products/by-category', {
      params: { slug: categorySlug },
    });
    return data.data || [];
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
};

/* ============================================================
   2. Get sale products
============================================================ */

export const getSale = async () => {
  try {
    const data = await axiosClient.get('/products/sale');
    return data.data || [];
  } catch (error) {
    console.error('Error fetching sale products:', error);
    return [];
  }
};

/* ============================================================
   3. Save contact message
============================================================ */

export const saveContactMessage = async (contactData: {
  name: string;
  email: string;
  subject: string;
  message: string;
  ipAddress?: string;
  userAgent?: string;
}) => {
  try {
    const payload = {
      name: contactData.name,
      email: contactData.email,
      subject: contactData.subject,
      message: contactData.message,
      status: 'new',
      priority: 'medium',
      submittedAt: new Date().toISOString(),
      ipAddress: contactData.ipAddress || '',
      userAgent: contactData.userAgent || '',
    };

    const res = await axiosClient.post('/contact', payload);

    return { success: true, data: res.data };
  } catch (error) {
    console.error('Error saving contact message:', error);
    return { success: false, error: 'Failed to save contact message' };
  }
};

/* ============================================================
   4. Get orders with pagination
============================================================ */

export const getMyOrders = async (userId: string, page: number = 1, limit: number = 5) => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    const res = await axiosClient.get(`/orders/user/${userId}`, {
      params: { page, limit },
    });

    return {
      orders: res.data.orders || [],
      totalCount: res.data.totalCount || 0,
      totalPages: res.data.totalPages || 0,
      currentPage: res.data.currentPage || page,
      hasNextPage: res.data.hasNextPage || false,
      hasPrevPage: res.data.hasPrevPage || false,
    };
  } catch (error) {
    console.error('Error fetching orders:', error);

    return {
      orders: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: 1,
      hasNextPage: false,
      hasPrevPage: false,
    };
  }
};
