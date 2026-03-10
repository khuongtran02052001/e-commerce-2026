import type { Order } from './order';

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  imageUrl: string;
  createdAt: number;
  lastSignInAt: number;
  emailVerified: boolean;
}

export interface AdminProduct {
  id: string;
  _type: 'product';
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  name: string;
  slug?: {
    current: string;
    _type: 'slug';
  };
  description?: string;
  price: number;
  discount?: number;
  stock: number;
  category?: {
    id: string;
    name: string;
    title: string;
    slug?: {
      current: string;
    };
  };
  brand?: {
    id: string;
    name: string;
    title: string;
    slug?: {
      current: string;
    };
  };
  status: 'new' | 'hot' | 'sale';
  variant?: 'gadget' | 'appliances' | 'refrigerators' | 'others';
  featured: boolean;
  isFeatured?: boolean;
  images?: Array<{
    asset?: {
      _ref: string;
      _type: 'reference';
    };
    _type: 'image';
    _key: string;
  }>;
}

export interface AdminAnalytics {
  overview: {
    totalOrders: number;
    totalRevenue: number;
    totalProducts: number;
    totalUsers: number;
  };
  charts: {
    revenueByDay: Array<{ date: string; revenue: number }>;
    ordersByStatus: Array<{ status: string; count: number }>;
    ordersByPaymentMethod: Array<{ method: string; count: number }>;
  };
}

export interface ChartDataPoint {
  month: string;
  date?: string;
  revenue: number;
  orders: number;
  users: number;
}

export type { Order };

